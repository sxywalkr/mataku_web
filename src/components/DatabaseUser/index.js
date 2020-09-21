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
// import TextField from '@material-ui/core/TextField';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import dateFnsFormat from 'date-fns/format';

// import Card from '@material-ui/core/Card';
// import CardActionArea from '@material-ui/core/CardActionArea';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import CardMedia from '@material-ui/core/CardMedia';
// import getMonth from 'date-fns/getMonth'
// import { format, compareAsc } from 'date-fns';
// import DateFnsUtils from '@date-io/date-fns';
// import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
// import InputLabel from '@material-ui/core/InputLabel';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
import XLSX from 'xlsx';
import MUIDataTable from "mui-datatables";
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
      itemTelepon1: '',
      itemTelepon2: '',
      itemPekerjaan: '',
      itemPuskesmas: '',
      itemUid: '',
      itemUmur: '',
      itemJaminanKesehatan: '',
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
          const a = []
          snapshot.forEach(el => {
            a.push({
              Nama: el.val().itemNama,
              Telepon1: el.val().itemTelepon1,
              Telepon2: el.val().itemTelepon2,
              Alamat: el.val().itemAlamat,
              Pekerjaan: el.val().itemPekerjaan,
              Umur: el.val().itemUmur,
              JaminanKesehatan: el.val().itemJaminanKesehatan,
              Kabupaten: el.val().itemKabupaten,
              Kecamatan: el.val().itemKecamatan,
              DesaKelurahan: el.val().itemDesaKelurahan,
              Puskesmas: el.val().itemPuskesmas,
              KonfirmKatarak: el.val().itemKonfirmKatarak,
              Detail: [el.val().itemUid, el.val()],
              itemRemarkDeletePic: el.val().itemRemarkDeletePic ? el.val().itemRemarkDeletePic : undefined,
            })
          })
          this.setState({
            items: produksList,
            itemsA: a,
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
    const ws = XLSX.utils.json_to_sheet(this.state.itemsA);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "master database");
    XLSX.writeFile(wb, "master data pasien.xlsx")
  };

  columns = [{
    name: "Nama",
    label: "Nama",
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: "Kabupaten",
    label: "Kabupaten",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Kecamatan",
    label: "Kecamatan",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "DesaKelurahan",
    label: "Desa Kelurahan",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Puskesmas",
    label: "Puskesmas",
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: "Detail",
    label: "Action",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value, tableMeta, updateValue) => {
        return (
          // console.log({value})
          <Button component={Link}
            to={{
              pathname: `${ROUTES.DATABASEUSER}/${value[0]}`,
              state: value[1],
            }}
          >
            Detail
          </Button>
          // <Button variant="outlined" color="primary" onClick={() => this.handleSubmitKeAnalysis(value[0])}
          //   disabled={value[1] === "Update detail by admin lab done" ? false : true}
          // >
          //   Submit ke Analis
          // </Button>
        );
      }
    }
  },
  ];

  options = {
    filterType: 'dropdown',
    rowsPerPage: 20,
    selectableRows: 'none',
    download: false,
    print: false,
  };

  render() {
    const { loading, items, itemsA } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <CircularProgress /> :
              <div>
                <div style={{ width: '100%' }}>
                  <Box p={1} >
                    <Button variant="outlined" color="primary" onClick={this.exportFile}>
                      Export All Master Database to Excel
                    </Button>
                  </Box>
                </div>
                {/* {console.log('a', items)} */}
                {/* {console.log('b', itemsA)} */}
                <MUIDataTable
                  // title={"Tabel Master Data"}
                  data={this.state.itemsA}
                  columns={this.columns}
                  options={this.options}
                />

                {/* <Table>
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
                </Table> */}
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
    console.log(this.props.location.state)
    this.state = {
      loading: false,
      open: false,
      open2: false,
      loading2: false,
      item: this.props.location.state,
      konfirmKatarak: null,
      konfirmDeletePic: this.props.location.state.itemRemarkDeletePic === undefined ? 'Gambar belum di pindah ke lokal disk atau cloud storage' : this.props.location.state.itemRemarkDeletePic,
      itemFoto1: '',
      itemFoto2: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    // console.log(this.props.location.state.el.itemRemarkDeletePic)
    // console.log(this.props.location.state.el)
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

  handleNegatifKatarak = () => {
    try {
      this.props.firebase.db.ref(`dbPasien/${this.state.item.itemUid}`).update({
        itemKonfirmKatarak: 'Pasien Negatif Katarak',
      }).then((succ) => this.setState({ konfirmKatarak: 'Pasien Negatif Katarak' }))
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
              {konfirmDeletePic !== 'Pic Deleted' &&
                <Button variant="outlined" color="primary" onClick={() => this.setState({ open: true })}>
                  Hapus Gambar
                </Button>}
            </Box>
            <Box p={1} bgcolor="background.paper">
              <Typography variant="subtitle1" gutterBottom>Nama : {item.itemNama}</Typography>
              <Typography variant="subtitle1" gutterBottom>Alamat : {item.itemAlamat}</Typography>
              <Typography variant="subtitle1" gutterBottom>Telepon1 : {item.itemTelepon1}</Typography>
              <Typography variant="subtitle1" gutterBottom>Telepon2 : {item.itemTelepon2}</Typography>
              <Typography variant="subtitle1" gutterBottom>Jenis Kelamin : {item.itemJenisKelamin}</Typography>
              <Typography variant="subtitle1" gutterBottom>Umur : {item.itemUmur}</Typography>
              <Typography variant="subtitle1" gutterBottom>Jaminan Kesehatan : {item.itemJaminanKesehatan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Puskesmas : {item.itemPuskesmas}</Typography>
              <Typography variant="subtitle1" gutterBottom>Desa/Kelurahan : {item.itemDesaKelurahan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Kecamatan : {item.itemKecamatan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Kabupaten : {item.itemKabupaten}</Typography>
              <Typography variant="subtitle1" gutterBottom>Visus Mata Kiri : {item.itemVisusMataKiri}</Typography>
              <Typography variant="subtitle1" gutterBottom>Visus Mata Kanan : {item.itemVisusMataKanan}</Typography>
              <Typography variant="subtitle1" gutterBottom>Status Pasien : {konfirmKatarak ? konfirmKatarak : item.itemKonfirmKatarak}</Typography>
              <Typography variant="subtitle1" gutterBottom>Status Gambar : {konfirmDeletePic === 'Pic Deleted' ? 'Gambar sudah dihapus dari firebase storage' : konfirmDeletePic}</Typography>
            </Box>
            {konfirmDeletePic !== 'Pic Deleted' ?
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
                  Pastikan gambar sudah di save ke local disk atau cloud storage
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
                <Button onClick={this.handleNegatifKatarak} color="secondary" variant='contained' autoFocus>
                  Negatif Katarak
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
