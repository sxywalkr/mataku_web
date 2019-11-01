import React, { PureComponent, Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import dateFnsFormat from 'date-fns/format';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
// import getMonth from 'date-fns/getMonth'
// import { format, compareAsc } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import XLSX from 'xlsx';
// import { writeFile, DocumentDirectoryPath } from 'react-native-fs';
// import { saveAs } from 'file-saver';

class MainPage extends Component {

  render() {
    return (

      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Database User
          </Typography>
          <Switch>
            <Route exact path={ROUTES.DATABASEUSER_DETAILS} component={ItemDetail} />
            <Route exact path={ROUTES.DATABASEUSER} component={ItemList} />
          </Switch>
        </Paper>
      </Grid>
    );
  }

}

/////////////////////////////////////////// ALL DATA
class AllPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: '',
      itemAlamat: '',
      itemDesaKelurahan: '',
      itemFlag: '',
      itemFoto1: '',
      itemFoto2: '',
      itemJenisKelamin: '',
      itemKabupaten: '',
      itemKecamatan: '',
      itemNama: '',
      itemPekerjaan: '',
      itemPuskesmas: '',
      itemUid: '',
      itemUmur: '',
      tmName: '',
      tmUid: '',
    };
  }



  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.dbPasiens()
      .orderByChild('itemFlag').equalTo('Item di submit')
      .on('value', snapshot => {
        if (snapshot.val()) {
          const produksObject = snapshot.val();
          const produksList = Object.keys(produksObject).map(key => ({
            ...produksObject[key],
            uid: key,
          }));
          this.setState({
            items: produksList,
            loading: false,
          });
        } else {
          this.setState({
            items: null,
            loading: false,
          });
        }
      })
  }

  componentWillUnmount() {
    this.props.firebase.dbPasiens().off();
  }

  handleDelete = propSample =>
    this.props.firebase.db.ref('dbPasiens/' + propSample).remove();

  handleClickOpen = authUser => {
    this.setState({ authUser: authUser, open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDateChange = date => {
    this.setState({ tanggalTransaksi: date });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
    if (name === 'selectBulan') {
      this.proses(event.target.value)
    }
  };

  proses = (a) => {
    this.props.firebase.hariancss()
      .orderByChild('bulanTransaksi').equalTo(a)
      .on('value', snapshot => {
        if (snapshot.val()) {
          const hariancssObject = snapshot.val();
          const hariancssList = Object.keys(hariancssObject).map(key => ({
            // ...hariancssObject[key],
            // uid: key,
            bulanTransaksi: hariancssObject[key].bulanTransaksi,
            // dateFnsFormat(new Date(el.tanggalTransaksi), 'MM/dd/yyyy')
            // tanggalTransaksi: hariancssObject[key].tanggalTransaksi,
            tanggalTransaksi: dateFnsFormat(new Date(hariancssObject[key].tanggalTransaksi), 'MM/dd/yyyy'),
            kacabcs: hariancssObject[key].kacabcs,
            petugascs: hariancssObject[key].petugascs,
            namaproduk: hariancssObject[key].namaproduk,
            noaproduk: hariancssObject[key].noaproduk,
            voaproduk: hariancssObject[key].voaproduk,
            total: parseInt(hariancssObject[key].noaproduk) * parseInt(hariancssObject[key].voaproduk)
          }));
          this.setState({
            hariancss: hariancssList,
            arrayHolder: hariancssList,
            loading: false,
          });
        } else {
          this.setState({
            arrayHolder: null,
            hariancss: null,
            loading: false,
          });
        }
      })
    this.setState({
      selectKacab: 'KC KENDARI',
      selectUserCs: '',
    })
  }

  prosesFilter = (a, b) => {
    const q = this.state.arrayHolder;
    const result = q.filter(word => this.state.selectOperator === 'Dan' ? word.kacabcs === a && word.petugascs === b : word.kacabcs === a || word.petugascs === b);
    this.setState({ hariancss: result })
  }

  handleSubmit = () => {
    this.setState({ open: false });
    const a = this.props.firebase.db.ref('hariancs').push();
    this.props.firebase.db.ref('hariancs/' + a.key).update({
      idproduk: a.key,
      namaproduk: this.state.selectNamaproduk,
      noaproduk: this.state.noaproduk,
      voaproduk: this.state.voaproduk,
      petugascs: this.state.authUser.username,
      kacabcs: this.state.authUser.kacab,
      nipcs: this.state.authUser.nipUser,
      tanggalTransaksi: this.state.tanggalTransaksi ? this.state.tanggalTransaksi.toISOString() : new Date().toISOString(),
    })
    this.setState({
      selectNamaproduk: '',
      noaproduk: '',
      voaproduk: '',
    })
  }

  exportFile = () => {
    const ws = XLSX.utils.json_to_sheet(this.state.hariancss);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "db");
    XLSX.writeFile(wb, "dbKinerja.xlsx")
  };

  render() {
    // console.log(this.state.hariancss)
    const { loading, items } = this.state;
    // const isInvalid = tanggalTransaksi === '' || selectNamaproduk === '' || noaproduk === '' || voaproduk === ''
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <CircularProgress /> :
              <div>
                {/* <Box
                  display="flex"
                  alignItems="flex-end"
                  p={1}
                  m={1}
                  css={{ height: 50 }}
                >
                  <Box p={1} >
                    <FormControl variant="standard">
                      <InputLabel htmlFor="selectBulan">Bulan</InputLabel>{" "}
                      <Select
                        value={selectBulan}
                        onChange={this.onChange('selectBulan')}
                        style={{ width: 200 }}
                        name="selectBulan"
                      >
                        <MenuItem key={1} value={0}>Januari</MenuItem>
                        <MenuItem key={2} value={1}>Februari</MenuItem>
                        <MenuItem key={3} value={2}>Maret</MenuItem>
                        <MenuItem key={4} value={3}>April</MenuItem>
                        <MenuItem key={5} value={4}>Mei</MenuItem>
                        <MenuItem key={6} value={5}>Juni</MenuItem>
                        <MenuItem key={7} value={6}>Juli</MenuItem>
                        <MenuItem key={8} value={7}>Agustus</MenuItem>
                        <MenuItem key={9} value={8}>September</MenuItem>
                        <MenuItem key={10} value={9}>Oktober</MenuItem>
                        <MenuItem key={11} value={10}>November</MenuItem>
                        <MenuItem key={12} value={11}>Desember</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box> */}
                <div style={{ width: '100%' }}>
                  {/* <Box
                    display="flex"
                    alignItems="flex-end"
                    p={1}
                    m={1}
                    css={{ height: 30 }}
                  >
                    <Box p={1} >
                      <FormControl variant="standard">
                        <InputLabel htmlFor="selectKacab">Kantor Cabang</InputLabel>{" "}
                        <Select
                          value={selectKacab}
                          onChange={this.onChange('selectKacab')}
                          style={{ width: 200 }}
                          name="selectKacab"
                        // disabled={ this.state.hariancss === [] || this.state.hariancss === null ? true : false }
                        >
                          <MenuItem value="---">---</MenuItem>
                          <MenuItem value="KC KENDARI">KC KENDARI</MenuItem>
                          <MenuItem value="KCP KOLAKA">KCP KOLAKA</MenuItem>
                          <MenuItem value="KCP BAUBAU">KCP BAUBAU</MenuItem>
                          <MenuItem value="KK ANDUONOHU">KK ANDUONOHU</MenuItem>
                          <MenuItem value="KK UNHALU">KK UNHALU</MenuItem>
                          <MenuItem value="KLKK KONAWE">KLKK KONAWE</MenuItem>
                          <MenuItem value="KLKK KENDARI">KLKK KENDARI</MenuItem>
                          <MenuItem value="KLKK BAUBAU">KLKK BAUBAU</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box p={1} >
                      <FormControl variant="standard">
                        <InputLabel htmlFor="selectOperator">Operator</InputLabel>{" "}
                        <Select
                          value={selectOperator}
                          onChange={this.onChange('selectOperator')}
                          // style={{ width: 200 }}
                          name="selectOperator"
                        >
                          <MenuItem value="Dan">Dan</MenuItem>
                          <MenuItem value="Atau">Atau</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box p={1} >
                      <FormControl variant="standard">
                        <InputLabel htmlFor="selectUserCs">CS</InputLabel>{" "}
                        <Select
                          value={selectUserCs}
                          onChange={this.onChange('selectUserCs')}
                          style={{ width: 200 }}
                          name="selectUserCs"
                        >
                            <MenuItem key={999} value="---">---</MenuItem>
                          {!!userCs && userCs.map((el, key) =>
                            <MenuItem key={key} value={el.username}>{el.username}</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Box>
                    <Box p={1} >
                      <Button variant="outlined" color="primary" onClick={() => this.prosesFilter(this.state.selectKacab, this.state.selectUserCs)}>
                        Proses
                    </Button>
                    </Box>
                    <Box p={1} >
                      <Button variant="outlined" color="primary" onClick={this.exportFile}>
                        Export Excel
                    </Button>
                    </Box>
                  </Box> */}
                </div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama</TableCell>
                      <TableCell>Kabupaten</TableCell>
                      <TableCell>Kecamatan</TableCell>
                      <TableCell>Desa/Kelurahan</TableCell>
                      <TableCell>Puskesmas</TableCell>
                      <TableCell colSpan={2}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && !!items && items.map((el, key) =>
                      <TableRow key={key}>
                        {/* <TableCell>{dateFnsFormat(new Date(el.tanggalTransaksi), 'MM/dd/yyyy')}</TableCell> */}
                        <TableCell>{el.itemNama}</TableCell>
                        <TableCell>{el.itemKabupaten}</TableCell>
                        <TableCell>{el.itemKecamatan}</TableCell>
                        <TableCell>{el.itemDesaKelurahan}</TableCell>
                        <TableCell>{el.itemPuskesmas}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.DATABASEUSER}/${el.itemUid}`,
                              state: { el },
                            }}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }

}

/////////////////////////////////////////// UBAH DATA
class DetailPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      open: false,
      open2: false,
      loading2: false,
      item: this.props.location.state.el,
      konfirmKatarak: null,
      konfirmDeletePic: null,
      itemFoto1: '',
      itemFoto2: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    // this.setState({ loading: true });
    // this.props.firebase
    //   .db.ref('hariancs/' + this.props.match.params.id)
    //   .on('value', snapshot => {
    //     if (snapshot.val()) {
    //       this.setState({
    //         hariancs: snapshot.val(),
    //         namaproduk: snapshot.val().namaproduk,
    //         noaproduk: snapshot.val().noaproduk,
    //         voaproduk: snapshot.val().voaproduk,
    //         loading: false,
    //       });
    //     } else {
    //       this.setState({
    //         hariancs: null,
    //         loading: false,
    //       })
    //     }
    //   });
    // var storage = firebase.storage();
    // var pathReference = storage.ref(`${item.tmUid}/${item.itemUid}/1.jpg`);
    // const storage = this.props.firebase.storage()
    this.props.firebase.storage.ref(`${this.state.item.tmUid}/${this.state.item.itemUid}/1.jpg`).getDownloadURL().then((url) => this.setState({ itemFoto1: url }))
    this.props.firebase.storage.ref(`${this.state.item.tmUid}/${this.state.item.itemUid}/2.jpg`).getDownloadURL().then((url) => this.setState({ itemFoto2: url }))


  }

  // componentDidUpdate() {
  //   if (this.state.loading2 === true) {
  //     // console.log('loading2', this.props.location.state.el.itemKonfirmKatarak, this.props.location.state.el)
  //     // this.props.location.state.el.itemKonfirmKatarak = 'Pasien Katarak'
  //     this.setState({ konfirmKatarak : 'Pasien Positif Katarak', loading2: false })

  //     // this.props.firebase
  //     //   .db.ref('dbPasien/' + this.state.item.tmUid)
  //     //   .once('value', snapshot => {
  //     //     if (snapshot.val()) {
  //     //       this.setState({
  //     //         konfirmKatarak: snapshot.val().itemKonfirmKatarak,
  //     //         loading2: false,
  //     //       });
  //     //     } else {
  //     //       this.setState({
  //     //         konfirmKatarak: null,
  //     //         loading2: false,
  //     //       })
  //     //     }
  //     //   });
  //   }
  // }

  // componentWillUnmount() {
  //   this.props.firebase.hariancs(this.props.match.params.id).off();
  // }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  handleClose2 = () => {
    this.setState({ open2: false });
  };

  // onChange = name => event => {
  //   this.setState({
  //     [name]: event.target.value,
  //   });
  // };

  // handleSubmit = () => {
  //   this.setState({ open: false });
  //   this.props.firebase.db.ref('hariancs/' + this.state.hariancs.idproduk).update({
  //     // namaproduk: this.state.namaproduk,
  //     noaproduk: this.state.noaproduk,
  //     voaproduk: this.state.voaproduk,
  //   });
  //   // this.setState({ loading: true })
  //   this.forceUpdate();
  // }

  handleDeletePic = () => {
    this.props.firebase.storage.ref(`${this.state.item.tmUid}/${this.state.item.itemUid}/2.jpg`).delete()
    this.props.firebase.storage.ref(`${this.state.item.tmUid}/${this.state.item.itemUid}/1.jpg`).delete()
      .then((succ) => {
        this.props.firebase.db.ref(`dbPasien/${this.state.item.itemUid}`).update({
          itemRemarkDeletePic: 'Pic Deleted',
        })
        .then((succ) => this.setState({ konfirmDeletePic: 'Pic Deleted' }))

      })
      .catch((e) => console.log(e))
      .finally(() => {
        this.setState({ open: false })
      })
  }

  handlePositifKatarak = () => {
    try {
      this.props.firebase.db.ref(`dbPasien/${this.state.item.itemUid}`).update({
        itemKonfirmKatarak: 'Pasien Positif Katarak',
      }).then((succ) => this.setState({ konfirmKatarak: 'Pasien Positif Katarak' }))
    } catch (e) {
    }
    finally {
      this.setState({ open2: false })
    }
  }



  render() {

    const { item, loading, konfirmKatarak, konfirmDeletePic } = this.state;
    // const isInvalid = noaproduk === '' || voaproduk === ''
    return (
      <div style={{ width: '100%' }}>
        {loading ? <CircularProgress /> :
          <Box display="flex" flexDirection='column'>
            <Box p={1}>
              <Button>
                <Link
                  to={{
                    pathname: `${ROUTES.DATABASEUSER}`,
                  }}
                >
                  BACK
              </Link>
              </Button>{' '}
              <Button variant="outlined" color="primary" onClick={() => this.setState({ open2: true })}>
                Konfirmasi Katarak
              </Button>{' '}
              {!konfirmDeletePic === null || item.itemRemarkDeletePic !== 'Pic Deleted' &&
                <Button variant="outlined" color="primary" onClick={() => this.setState({ open: true })}>
                  Hapus Gambar
                </Button>}
            </Box>
            <Box p={1} bgcolor="background.paper">
              <Typography variant="subtitle1" gutterBottom>Nama : {item.itemNama}</Typography>
              <Typography variant="subtitle1" gutterBottom>itemAlamat : {item.itemitemAlamat}</Typography>
              <Typography variant="subtitle1" gutterBottom>itemJenisKelamin : {item.itemitemJenisKelamin}</Typography>
              <Typography variant="subtitle1" gutterBottom>itemUmur : {item.itemitemUmur}</Typography>
              <Typography variant="subtitle1" gutterBottom>Puskesmas : {item.itemPuskesmas}</Typography>
              <Typography variant="subtitle1" gutterBottom>Desa/Kelurahan : {item.itemDesaKelurahan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Kecamatan : {item.itemKecamatan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Kabupaten : {item.itemKabupaten}</Typography>
              <Typography variant="subtitle1" gutterBottom>Status Pasien : {konfirmKatarak ? konfirmKatarak : item.itemKonfirmKatarak}</Typography>
              <Typography variant="subtitle1" gutterBottom>{item.itemRemarkDeletePic === 'Pic Deleted' ? 'Gambar sudah dihapus dari firebase storage' : '' }</Typography>
            </Box>
            {/* {console.log(konfirmDeletePic)} */}
            {!konfirmDeletePic === null || item.itemRemarkDeletePic !== 'Pic Deleted'?
              <Box display="flex" flexDirection='row' >
                <Box p={1} display="flex" flexDirection='column' alignItems='center'>
                  <Typography variant="subtitle1" gutterBottom>Mata Kiri</Typography>
                  <img style={{ padding: 10 }} src={this.state.itemFoto1} />
                </Box>
                <Box p={1} display="flex" flexDirection='column' alignItems='center'>
                  <Typography variant="subtitle1" gutterBottom>Mata Kanan</Typography>
                  <img style={{ padding: 10 }} src={this.state.itemFoto2} />
                </Box>
              </Box> : ''}

            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
              <DialogTitle id="simple-dialog-title">Konfirmasi</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Hapus gambar dari firebase storage?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="secondary">
                  Batal
                </Button>
                <Button onClick={this.handleDeletePic} color="primary" variant='contained' autoFocus>
                  Hapus
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog onClose={this.handleClose2} aria-labelledby="simple-dialog-title" open={this.state.open2}>
              <DialogTitle id="simple-dialog-title">Konfirmasi</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Konfirmasi pasien positif Katarak?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose2} color="secondary">
                  Batal
                </Button>
                <Button onClick={this.handlePositifKatarak} color="primary" variant='contained' autoFocus>
                  Positif Katarak
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        }
      </div>
    );
  }

}

const condition = authUser => authUser && authUser.userRole.includes(ROLES.ADMIN);

const ItemList = withFirebase(AllPage);
const ItemDetail = withFirebase(DetailPage);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainPage);
