import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { AuthUserContext, withAuthorization } from '../Session';
// import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DateFnsUtils from '@date-io/date-fns';
// import {format, compareAsc} from 'date-fns/esm'
import dateFnsFormat from 'date-fns/format';
// import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import Input from '@material-ui/core/Input';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import { PDFDownloadLink, PDFViewer, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';


class MainSampleBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  render() {
    return (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Pelaksana Fungsi Teknis Page
          </Typography>
          <Switch>
            <Route exact path={ROUTES.TEKNIS_DETAILS} component={PageDetail} />
            <Route exact path={ROUTES.TEKNIS} component={PageAll} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}


///////////////////////////// VIEW ALL DATA
class PageAllBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      formMode: [],
      items2: '',
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples')
      // .orderByChild('flagStatusProses')
      // .equalTo('Proses di Pelaksana Teknis')
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          snap.forEach(el => {
            if ( el.val().flagStatusProses !== 'Sampel tidak dapat diuji') 
            {a.push({
              idPermohonanUji: el.val().idPermohonanUji,
              kodeUnikSampel: el.val().kodeUnikSampel,
              tanggalMasukSampel: el.val().tanggalMasukSampel,
              nomorAgendaSurat: el.val().nomorAgendaSurat,
              namaPemilikSampel: el.val().namaPemilikSampel,
              alamatPemilikSampel: el.val().alamatPemilikSampel,
              asalTujuanSampel: el.val().asalTujuanSampel,
              petugasPengambilSampel: el.val().petugasPengambilSampel,
              flagActivity: el.val().flagActivity,
              flagActivityDetail: el.val().flagActivityDetail,
              flagStatusProses: el.val().flagStatusProses,
              kodeUnikSampelAdminLab: el.val().kodeUnikSampelAdminLab,
              nomorAgendaSurat: el.val().nomorAgendaSurat,
              tanggalTerimaSampelAdminLab: el.val().tanggalTerimaSampelAdminLab,
              unitPengujianSampel: el.val().unitPengujianSampel,
              tanggalUjiSampelAnalis: el.val().tanggalUjiSampelAnalis,
              kondisiSampel: el.val().kondisiSampel,
              manajerAdministrasiAdminLab: el.val().manajerAdministrasiAdminLab,
              manajerTeknisAdminLab: el.val().manajerTeknisAdminLab,
              nipManajerTeknisAdminLab: el.val().nipManajerTeknisAdminLab,
              penyeliaAnalis: el.val().penyeliaAnalis,
              nipPenyeliaAnalis: el.val().nipPenyeliaAnalis,
              penerimaSampelAnalisLab: el.val().penerimaSampelAnalisLab,
              nipPenerimaSampelAnalisLab: el.val().nipPenerimaSampelAnalisLab,
              zItems: el.val().zItems,
            })}
          });
          this.setState({
            items: a,
            items2: snap.val(),
            loading: false,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
      })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

  handleDelete = propSample =>
    this.props.firebase.db.ref('samples/' + propSample).remove();

  handleUbah = propSample => {
    this.setState({ open: true, formMode: [propSample] });
  }

  handleSubmitLhuOk = propSample => {
    this.props.firebase.db.ref('samples/' + propSample).update({
      flagActivity: 'Laporan Hasil Uji di Admin Lab',
      flagActivityDetail: 'Laporan Hasil Uji di Admin Lab',
      flagStatusProses: 'Laporan Hasil Uji di Admin Lab'
    })
  }

  render() {
    const { items, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading ? <Typography>Loading...</Typography> :
              <div>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nomor Permohonan (IQFAST)</TableCell>
                      <TableCell>Tanggal Masuk Sampel</TableCell>
                      <TableCell>Nama Pemilik Sampel</TableCell>
                      <TableCell>Asal/Tujuan Media Pembawa</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell colSpan={2}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  {!loading && !!items && items.map((el, key) =>
                    <TableBody key={key}>
                      <TableRow>
                        <TableCell>{el.nomorAgendaSurat}</TableCell>
                        <TableCell>{dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</TableCell>
                        <TableCell>{el.namaPemilikSampel}</TableCell>
                        <TableCell>{el.asalTujuanSampel}</TableCell>
                        <TableCell>{el.flagStatusProses}</TableCell>
                        <TableCell>
                          <Button component={Link}
                            to={{
                              pathname: `${ROUTES.TEKNIS}/${el.idPermohonanUji}`,
                              data: { el },
                            }}
                            disabled={el.flagStatusProses === "Proses di Pelaksana Teknis" ? false : true}
                          >
                            Detail
                          </Button>
                        </TableCell>
                        {/* <TableCell>
                          <PDFDownloadLink document={<PDFLHU q={el} />} fileName="laporan-hasil-uji.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Uji')}
                          </PDFDownloadLink>
                        </TableCell> */}
                        <TableCell>
                          {el.flagStatusProses === 'Proses di Pelaksana Teknis' || el.flagStatusProses === 'Laporan Hasil Uji di Admin Lab' ?
                            <PDFDownloadLink document={<PdfLHP q={el} />} fileName="laporan-hasil-uji.pdf">
                              {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Laporan Hasil Pengujian')}
                            </PDFDownloadLink>
                            :
                            'Laporan Hasil Pengujian belum tersedia.'
                          }
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="primary" onClick={() => this.handleSubmitLhuOk(el.idPermohonanUji)}
                            disabled={el.flagActivityDetail === "Update keterangan by manajer teknis done" ? false : true}
                          >
                            Laporan Hasil Uji OK
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </div>
            }
          </div>
        )}
      </AuthUserContext.Consumer>
    )
  }

}

///////////////////////////// UBAH DATA
class PageDetailBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      items: [],
      open: false,
      open2: false,
      ...props.location.state,
      idPermohonanUji: '',
      kodeUnikSampel: '',
      tanggalMasukSampel: '',
      kodeUnikSampelAdminLab: '',
      nomorAgendaSurat: '',
      namaPemilikSampel: '',
      alamatPemilikSampel: '',
      asalTujuanSampel: '',
      petugasPengambilSampel: '',
      jenisSampel: '',
      jumlahSampel: '',
      kondisiSampel: '',
      jenisPengujianSampel: '',
      ruangLingkupSampel: '',
      unitPengujian: '',
      selectJenisPengujian: [],
      selectMetodePengujian: [],
      selectUnitPengujian: [],
      tanggalTerimaSampelAdminLab: new Date(),
      penerimaSampelAdminLab: '',
      penerimaSampelAnalisLab: '',
      manajerTeknisAdminLab: '',
      manajerAdministrasiAdminLab: '',
      thisP: '',
      thisQ: '',
      formLaporanKeterangan: '',
      formLaporanKesimpulan: '',
    };
  }

  componentDidMount() {
    // console.log(this.props);
    this.setState({ loading: true });
    this.props.firebase.db.ref('samples/' + this.props.match.params.id)
      .on('value', snap => {
        if (snap.val()) {
          const a = [];
          a.push(snap.val());
          this.setState({
            items: a,
            loading: false,
            idPermohonanUji: snap.val().idPermohonanUji,
            kodeUnikSampel: snap.val().kodeUnikSampel,
            tanggalMasukSampel: snap.val().tanggalMasukSampel,
            // kodeUnikSampelAdminLab: snap.val().kodeUnikSampelAdminLab,
            nomorAgendaSurat: snap.val().nomorAgendaSurat,
            namaPemilikSampel: snap.val().namaPemilikSampel,
            alamatPemilikSampel: snap.val().alamatPemilikSampel,
            asalTujuanSampel: snap.val().asalTujuanSampel,
            petugasPengambilSampel: snap.val().petugasPengambilSampel,
          });
        } else {
          this.setState({ items: null, loading: false });
        }
      })
    this.props.firebase.db.ref('masterData/userform')
      .on('value', snap1 => {
        if (snap1.val()) {
          const b1 = [];
          const b2 = [];
          const b3 = [];
          const b4 = [];
          snap1.forEach((res) => {
            if (res.val().jabatanUserForm === 'Admin Lab') {
              b1.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Administrasi') {
              b2.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Manajer Teknis') {
              b3.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            } else if (res.val().jabatanUserForm === 'Analis') {
              b4.push({
                idUserForm: res.val().idUserForm,
                jabatanUserForm: res.val().jabatanUserForm,
                namaUserForm: res.val().namaUserForm,
                nipUserForm: res.val().nipUserForm,
              })
            }
          })
          this.setState({
            selectUserformAdminLab: b1,
            selectUserformManajerAdministrasi: b2,
            selectUserformManajerTeknis: b3,
            selectUserformAnalis: b4,
          });
        }
      })
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('samples').off();
  }

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
    this.setState({ open2: false, unitPengujianSampel: '' });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      formLaporanKeterangan: this.state.formLaporanKeterangan,
      formLaporanKesimpulan: this.state.formLaporanKesimpulan,
    });
    this.props.firebase.db.ref('samples/' + this.state.idPermohonanUji).update({
      flagActivityDetail: 'Update keterangan by manajer teknis done',
    })
  }

  handleSubmit2 = () => {
    this.setState({ open2: false });
    this.props.firebase.db.ref('samples/' + this.state.thisP + '/zItems/' + this.state.thisQ).update({
      unitPengujianSampel: this.state.unitPengujianSampel,
    })
    this.props.firebase.db.ref('samples/' + this.state.thisP).update({
      flagActivityDetail: 'Update detail by admin lab done',
    })
  }

  handleUbah2 = (p, q, r) => {
    this.setState({ open2: true });
    if (r === 'TPC' || r === 'RAPID TEST KIT') {
      this.setState({
        selectUnitPengujian: ['Mikrobiologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'HA-HI/AI-ND') {
      this.setState({
        selectUnitPengujian: ['Virologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'ELISA RABIES' || r === 'ELISA BVD' || r === 'ELISA PARATB' || r === 'RBT') {
      this.setState({
        selectUnitPengujian: ['Serologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'PEWARNAAN GIEMSA' || r === 'MIKROSKOPIS') {
      this.setState({
        selectUnitPengujian: ['Parasitologi'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RT-PCR' || r === 'RT-DNA') {
      this.setState({
        selectUnitPengujian: ['Biomolekuler'],
        thisP: p, thisQ: q
      })
    } else if (r === 'RESIDU NITRIT' || r === 'FEED CHECK') {
      this.setState({
        selectUnitPengujian: ['PSAH'],
        thisP: p, thisQ: q
      })
    }
  }

  handleDateChange = date => {
    this.setState({ tanggalTerimaSampelAdminLab: date });
  };

  // onChange = id => event => {
  //   this.setState({
  //     [id]: event.target.value,
  //   });
  // };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  onChange2 = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const {
      selectUnitPengujian, unitPengujianSampel, loading, items,
      formLaporanKeterangan, formLaporanKesimpulan,
    } = this.state;
    const isInvalid = formLaporanKeterangan === '' || formLaporanKesimpulan === '';
    const isInvalid2 = unitPengujianSampel === '';
    // console.log(this.state)

    return (
      <div>
        {loading ? <Typography>Loading...</Typography> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              TAMBAH Keterangan
            </Button>{' '}
            <Button component={Link}
              to={{
                pathname: `${ROUTES.TEKNIS}`,
              }}
            >
              BACK
            </Button>
            {!loading && items.map((el, key) =>
              <div style={{ marginTop: 25 }} key={key}>
                {/* <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.kodeUnikSampel}</Typography> */}
                <Typography variant="subtitle1" gutterBottom>Tanggal Masuk Sampel : {dateFnsFormat(new Date(el.tanggalMasukSampel), "MM/dd/yyyy")}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nomor Permohonan (IQFAST) : {el.nomorAgendaSurat}</Typography>
                <Typography variant="subtitle1" gutterBottom>Nama Pemilik Sampel : {el.namaPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Alamat Pemilik Sampel : {el.alamatPemilikSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Asal/Tujuan Media Pembawa : {el.asalTujuanSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Petugas Pengambil Sampel (PPC) : {el.petugasPengambilSampel}</Typography>
                <Typography variant="subtitle1" gutterBottom>Unit Pengujian Sampel : {el.unitPengujianSampel}</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Jenis Sampel</TableCell>
                      <TableCell>Jumlah Sampel</TableCell>
                      <TableCell>Kondisi Sampel</TableCell>
                      <TableCell>Metode Pengujian</TableCell>
                      <TableCell>Target Pengujian</TableCell>
                      <TableCell>Hasil Pengujian</TableCell>
                      {/* <TableCell>Unit Pengujian</TableCell> */}
                      {/* <TableCell>Action</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!!el.zItems && Object.keys(el.zItems).map((el1, key1) =>
                      <TableRow key={key1}>
                        <TableCell>{el.zItems[el1].jenisSampel}</TableCell>
                        <TableCell>{el.zItems[el1].jumlahSampel}</TableCell>
                        <TableCell>{el.zItems[el1].kondisiSampel}</TableCell>
                        <TableCell>{el.zItems[el1].metodePengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].targetPengujianSampel}</TableCell>
                        <TableCell>{el.zItems[el1].hasilUjiSampel}</TableCell>
                        {/* <TableCell>{el.zItems[el1].unitPengujianSampel}</TableCell> */}
                        {/* <TableCell>
                          <Button variant="text" color="secondary" onClick={() => this.handleUbah2(el.idPermohonanUji, el1, el.zItems[el1].metodePengujianSampel)}>
                            Ubah
                          </Button>
                        </TableCell> */}
                        {/* <TableCell>
                          <PDFDownloadLink document={<Quixote q={el} />} fileName="form-permohonan-pengujian.pdf">
                            {({ blob, url, loading, error }) => (loading ? 'Loading pdf...' : 'Download Permohonan Pengujian')}
                          </PDFDownloadLink>
                        </TableCell> */}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
              maxWidth={'md'}
              fullWidth={true}
            >
              <DialogTitle id="form-dialog-title">Tambah Keterangan oleh Manajer Teknis</DialogTitle>
              <DialogContent>
                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DatePicker
                    margin="normal"
                    style={{ width: 350, marginBottom: 20 }}
                    label="Tanggal Terima Sampel oleh Admin Lab"
                    value={tanggalTerimaSampelAdminLab}
                    format={'MM/dd/yyyy'}
                    onChange={this.handleDateChange} />
                </MuiPickersUtilsProvider> */}

                <TextField
                  id="formLaporanKeterangan"
                  label="Keterangan Laporan"
                  style={{ width: "100%", marginBottom: 20, marginTop: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                <TextField
                  id="formLaporanKesimpulan"
                  label="Kesimpulan Laporan"
                  style={{ width: "100%", marginBottom: 20 }}
                  variant="outlined"
                  onChange={this.onChange}
                />
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    <MenuItem value="Mikrobiologi">Mikrobiologi</MenuItem>
                    <MenuItem value="Virologi">Virologi</MenuItem>
                    <MenuItem value="Serologi">Serologi</MenuItem>
                    <MenuItem value="Parasitologi">Parasitologi</MenuItem>
                    <MenuItem value="Biomolekuler">Biomolekuler</MenuItem>
                    <MenuItem value="PSAH">PSAH</MenuItem>
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="penerimaSampelAdminLab"
                  label="Admin Lab"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAdminLab">Admin Lab</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAdminLab}
                    onChange={this.onChange2('penerimaSampelAdminLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAdminLab"
                  >
                    {!!selectUserformAdminLab && Object.keys(selectUserformAdminLab).map((el) =>
                      <MenuItem key={el} value={selectUserformAdminLab[el].namaUserForm}>{selectUserformAdminLab[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="manajerAdministrasiAdminLab"
                  label="Manajer Administrasi"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerAdministrasiAdminLab">Manajer Administrasi</InputLabel>{" "}
                  <Select
                    value={manajerAdministrasiAdminLab}
                    onChange={this.onChange2('manajerAdministrasiAdminLab')}
                    style={{ width: 400 }}
                    name="manajerAdministrasiAdminLab"
                  >
                    {!!selectUserformManajerAdministrasi && Object.keys(selectUserformManajerAdministrasi).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerAdministrasi[el].namaUserForm}>{selectUserformManajerAdministrasi[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="manajerTeknisAdminLab"
                  label="Manajer Teknis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="manajerTeknisAdminLab">Manajer Teknis</InputLabel>{" "}
                  <Select
                    value={manajerTeknisAdminLab}
                    onChange={this.onChange2('manajerTeknisAdminLab')}
                    style={{ width: 400 }}
                    name="manajerTeknisAdminLab"
                  >
                    {!!selectUserformManajerTeknis && Object.keys(selectUserformManajerTeknis).map((el) =>
                      <MenuItem key={el} value={selectUserformManajerTeknis[el].namaUserForm}>{selectUserformManajerTeknis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
                {/* <TextField
                  id="penerimaSampelAnalisLab"
                  label="Analis"
                  style={{ width: "100%", marginBottom: 10 }}
                  variant="outlined"
                  onChange={this.onChange}
                /> */}
                {/* <FormControl style={{ marginBottom: 20 }} variant="standard">
                  <InputLabel htmlFor="penerimaSampelAnalisLab">Analis</InputLabel>{" "}
                  <Select
                    value={penerimaSampelAnalisLab}
                    onChange={this.onChange2('penerimaSampelAnalisLab')}
                    style={{ width: 400 }}
                    name="penerimaSampelAnalisLab"
                  >
                    {!!selectUserformAnalis && Object.keys(selectUserformAnalis).map((el) =>
                      <MenuItem key={el} value={selectUserformAnalis[el].namaUserForm}>{selectUserformAnalis[el].namaUserForm}</MenuItem>
                    )}
                  </Select>
                </FormControl> */}
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleClose}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleSubmit}
                  disabled={isInvalid}
                  color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={this.state.open2}
              onClose={this.handleClose2}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Update Unit Pengujian Sampel</DialogTitle>
              <DialogContent>
                <FormControl style={{ marginTop: 15 }} variant="standard">
                  <InputLabel htmlFor="unitPengujianSampel">Unit Pengujian Sampel</InputLabel>{" "}
                  <Select
                    value={unitPengujianSampel}
                    onChange={this.onChange2('unitPengujianSampel')}
                    name="unitPengujianSampel"
                    style={{ width: 400 }}
                  >
                    {!!selectUnitPengujian && selectUnitPengujian.map((elx, key) =>
                      <MenuItem key={key} value={elx}>{elx}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button color="secondary" onClick={this.handleClose2}>
                  Cancel
                </Button>
                <Button
                  variant="outlined"
                  onClick={this.handleSubmit2}
                  disabled={isInvalid2}
                  color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        }
      </div>
    )
  }

}

const condition = authUser => !!authUser;

const PageAll = withFirebase(PageAllBase);
const PageDetail = withFirebase(PageDetailBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainSampleBase);