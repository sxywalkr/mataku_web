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
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import dateFnsFormat from 'date-fns/format';
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
            Rekap Harian CS
          </Typography>
          <Switch>
            <Route exact path={ROUTES.REKAPCS_DETAILS} component={ItemDetail} />
            <Route exact path={ROUTES.REKAPCS} component={ItemList} />
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
      hariancss: [],
      open: false,
      selectNamaproduk: '',
      noaproduk: '',
      voaproduk: '',
      tanggalTransaksi: new Date(),
      selectBulan: '',
      selectKacab: '',
      selectUserCs: '',
      selectOperator: 'Atau'
    };
  }



  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.produks().on('value', snapshot => {
      if (snapshot.val()) {
        const produksObject = snapshot.val();
        const produksList = Object.keys(produksObject).map(key => ({
          ...produksObject[key],
          uid: key,
        }));
        this.setState({
          produks: produksList,
          loading: false,
        });
      } else {
        this.setState({
          produks: null,
          loading: false,
        });
      }
    })
    this.props.firebase.users().orderByChild('role').equalTo('CS').on('value', snapshot => {
      if (snapshot.val()) {
        // console.log(snapshot.val())
        const userCsObject = snapshot.val();
        const userCsList = Object.keys(userCsObject).map(key => ({
          ...userCsObject[key],
          uid: key,
        }));
        this.setState({
          userCs: userCsList,
          loading: false,
        });
      } else {
        this.setState({
          userCs: null,
          loading: false,
        });
      }
    })
  }

  componentWillUnmount() {
    this.props.firebase.hariancss().off();
    this.props.firebase.users().off();
  }

  handleDelete = propSample =>
    this.props.firebase.db.ref('hariancs/' + propSample).remove();

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
            total: parseInt(hariancssObject[key].noaproduk)*parseInt(hariancssObject[key].voaproduk)
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
    const { tanggalTransaksi, hariancss, loading, selectNamaproduk, produks, noaproduk, voaproduk, selectBulan, selectKacab, selectUserCs, userCs, selectOperator } = this.state;
    const isInvalid = tanggalTransaksi === '' || selectNamaproduk === '' || noaproduk === '' || voaproduk === ''
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <CircularProgress /> :
              <div>
                <Box
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
                </Box>
                <div style={{ width: '100%' }}>
                  <Box
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
                  </Box>
                </div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tanggal Transaksi</TableCell>
                      <TableCell>Kantor Cabang</TableCell>
                      <TableCell>Nama CS</TableCell>
                      <TableCell>Nama Produk</TableCell>
                      <TableCell>NOA (Unit)</TableCell>
                      <TableCell>VOA (Rp)</TableCell>
                      {/* <TableCell colSpan={2}>Action</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && !!hariancss && hariancss.map((el, key) =>
                      <TableRow key={key}>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalTransaksi), 'MM/dd/yyyy')}</TableCell>
                        <TableCell>{el.kacabcs}</TableCell>
                        <TableCell>{el.petugascs}</TableCell>
                        <TableCell>{el.namaproduk}</TableCell>
                        <TableCell>{el.noaproduk}</TableCell>
                        <TableCell>{el.voaproduk}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Dialog
                  maxWidth={'sm'}
                  fullWidth={true}
                  open={this.state.open}
                  onClose={this.handleClose}
                  aria-labelledby="form-dialog-title"
                >
                  <DialogTitle id="form-dialog-title">Tambah Data Produk</DialogTitle>
                  <DialogContent style={{ marginTop: 10, marginBottom: 15 }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <DatePicker
                        margin="normal"
                        style={{ width: 250, marginBottom: 10 }}
                        label="Tanggal Transaksi"
                        value={tanggalTransaksi}
                        format={'MM/dd/yyyy'}
                        onChange={this.handleDateChange} />
                    </MuiPickersUtilsProvider>
                    <FormControl style={{ marginBottom: 10 }} variant="standard">
                      <InputLabel htmlFor="selectNamaproduk">Produk</InputLabel>{" "}
                      <Select
                        value={selectNamaproduk}
                        onChange={this.onChange('selectNamaproduk')}
                        style={{ width: 400 }}
                        name="selectNamaproduk"
                      >
                        {!!produks && produks.map((el1, key) =>
                          <MenuItem key={key} value={el1.namaproduk}>{el1.namaproduk}</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                    <TextField
                      id="noaproduk"
                      name='noaproduk'
                      onChange={this.onChange('noaproduk')}
                      label='NOA (Unit)'
                      style={{ width: "100%", marginBottom: 10 }}
                      variant="outlined"
                      value={noaproduk}
                    />
                    <TextField
                      id="voaproduk"
                      name='voaproduk'
                      onChange={this.onChange('voaproduk')}
                      label='VOA (Rp)'
                      style={{ width: "100%", marginBottom: 10 }}
                      variant="outlined"
                      value={voaproduk}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button variant="text" color="secondary" onClick={this.handleClose}>
                      Cancel
              </Button>
                    <Button onClick={this.handleSubmit} variant='contained' color="primary" disabled={isInvalid}>
                      Submit
              </Button>
                  </DialogActions>
                </Dialog>
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
      namaproduk: '',
      noaproduk: '',
      voaproduk: '',
      hariancs: this.props.location.state.el,
      ...props.location.state,
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase
      .db.ref('hariancs/' + this.props.match.params.id)
      .on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            hariancs: snapshot.val(),
            namaproduk: snapshot.val().namaproduk,
            noaproduk: snapshot.val().noaproduk,
            voaproduk: snapshot.val().voaproduk,
            loading: false,
          });
        } else {
          this.setState({
            hariancs: null,
            loading: false,
          })
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.hariancs(this.props.match.params.id).off();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.firebase.db.ref('hariancs/' + this.state.hariancs.idproduk).update({
      // namaproduk: this.state.namaproduk,
      noaproduk: this.state.noaproduk,
      voaproduk: this.state.voaproduk,
    });
    // this.setState({ loading: true })
    this.forceUpdate();
  }


  render() {

    const { hariancs, loading, noaproduk, voaproduk } = this.state;
    const isInvalid = noaproduk === '' || voaproduk === ''
    return (
      <div>
        {loading ? <CircularProgress /> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Ubah Data
            </Button>{' '}
            <Button>
              <Link
                to={{
                  pathname: `${ROUTES.HARIANCS}`,
                }}
              >
                BACK
              </Link>
            </Button>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell>NOA (Unit)</TableCell>
                  <TableCell>VOA (Rp)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && !!hariancs &&
                  <TableRow>
                    <TableCell>{hariancs.namaproduk}</TableCell>
                    <TableCell>{hariancs.noaproduk}</TableCell>
                    <TableCell>{hariancs.voaproduk}</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Ubah Data Transaksi</DialogTitle>
              <DialogContent style={{ marginTop: 10, marginBottom: 15 }}>
                {/* <TextField
                  id="namaproduk"
                  name='namaproduk'
                  onChange={this.onChange('namaproduk')}
                  label='Nama Produk'
                  style={{ width: "100%" }}
                  variant="outlined"
                  autoFocus={true}
                /> */}
                <TextField
                  id="noaproduk"
                  name='noaproduk'
                  onChange={this.onChange('noaproduk')}
                  label='NOA (Unit)'
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  value={noaproduk}
                />
                <TextField
                  id="voaproduk"
                  name='voaproduk'
                  onChange={this.onChange('voaproduk')}
                  label='VOA (Rp)'
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  value={voaproduk}
                />
              </DialogContent>
              <DialogActions>
                <Button variant="text" color="secondary" onClick={this.handleClose}>
                  Cancel
              </Button>
                <Button onClick={this.handleSubmit} variant='contained' color="primary" disabled={isInvalid}>
                  Submit
              </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
      </div>
    );
  }

}

const condition = authUser => authUser && authUser.roles.includes(ROLES.ADMIN);

const ItemList = withFirebase(AllPage);
const ItemDetail = withFirebase(DetailPage);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainPage);
