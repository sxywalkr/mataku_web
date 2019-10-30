import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import { withAuthorization } from '../Session';
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

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      produks: [],
    };
  }

  // componentDidMount() {
  //   this.setState({ loading: true });

  //   this.props.firebase.produks().on('value', snapshot => {
  //     if (snapshot.val()) {
  //       const produksObject = snapshot.val();
  //       const produksList = Object.keys(produksObject).map(key => ({
  //         ...produksObject[key],
  //         uid: key,
  //       }));
  //       this.setState({
  //         produks: produksList,
  //         loading: false,
  //       });
  //     } else {
  //       this.setState({
  //         produks: null,
  //         loading: false,
  //       });
  //     }
  //   });

  // }

  // componentWillUnmount() {
  //   this.props.firebase.produks().off();
  // }

  render() {
    return (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Produk List
          </Typography>
          <Switch>
            <Route exact path={ROUTES.PRODUK_DETAILS} component={ItemDetail} />
            <Route exact path={ROUTES.PRODUK} component={ItemList} />
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
      produks: [],
      open: false,
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
  }

  componentWillUnmount() {
    this.props.firebase.produks().off();
  }

  handleDelete = propSample =>
    this.props.firebase.db.ref('produks/' + propSample).remove();

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
    const a = this.props.firebase.db.ref('produks').push();
    this.props.firebase.db.ref('produks/' + a.key).update({
      idproduk: a.key,
      namaproduk: this.state.namaproduk,
    })
  }

  render() {
    const { produks, loading } = this.state;
    return (
      <div>
        {loading ? <CircularProgress /> :
          <div>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Tambah Produk
        </Button>{' '}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Produk</TableCell>
                  <TableCell colSpan={2}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && !!produks && produks.map((el, key) =>
                  <TableRow key={key}>
                    <TableCell>{el.namaproduk}</TableCell>
                    <TableCell>
                      <Button component={Link}
                        to={{
                          pathname: `${ROUTES.PRODUK}/${el.idproduk}`,
                          state: { el },
                        }}
                      >
                        Detail
                  </Button>
                    </TableCell>
                    <TableCell>
                      <Button variant="text" color="secondary" onClick={() => this.handleDelete(el.uid)}>
                        Hapus
                  </Button>
                    </TableCell>
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
                <TextField
                  id="namaproduk"
                  name='namaproduk'
                  onChange={this.onChange('namaproduk')}
                  label='Nama Produk'
                  style={{ width: "100%" }}
                  variant="outlined"
                />

              </DialogContent>
              <DialogActions>
                <Button variant="text" color="secondary" onClick={this.handleClose}>
                  Cancel
              </Button>
                <Button onClick={this.handleSubmit} variant='contained' color="primary">
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

/////////////////////////////////////////// UBAH DATA
class DetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      open: false,
      namaproduk: '',
      noaproduk: '',
      voaproduk: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.produks) {
      return;
    }
    this.setState({ loading: true });
    this.props.firebase
      .produk(this.props.match.params.id)
      .on('value', snapshot => {
        if (snapshot.val()) {
          this.setState({
            produk: snapshot.val(),
            namaproduk: snapshot.val().namaproduk,
            loading: false,
          });
        } else {
          this.setState({
            produk: null,
            loading: false,
          })
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase.produks(this.props.match.params.id).off();
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
    this.props.firebase.db.ref('produks/' + this.props.match.params.id).update({
      namaproduk: this.state.namaproduk,
    })
  }


  render() {

    const { produk, loading } = this.state;
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
                  pathname: `${ROUTES.PRODUK}`,
                }}
              >
                BACK
              </Link>
            </Button>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Produk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading && !!produk &&
                  <TableRow>
                    <TableCell>{produk.namaproduk}</TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Ubah Data Produk</DialogTitle>
              <DialogContent style={{ marginTop: 10, marginBottom: 15 }}>
                <TextField
                  id="namaproduk"
                  name='namaproduk'
                  onChange={this.onChange('namaproduk')}
                  label='Nama Produk'
                  style={{ width: "100%" }}
                  variant="outlined"
                />
              </DialogContent>
              <DialogActions>
                <Button variant="text" color="secondary" onClick={this.handleClose}>
                  Cancel
              </Button>
                <Button onClick={this.handleSubmit} variant='contained' color="primary">
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

const condition = authUser => authUser && authUser.roles.includes(ROLES.SUPERADMIN);

const ItemList = withFirebase(AllPage);
const ItemDetail = withFirebase(DetailPage);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(MainPage);
