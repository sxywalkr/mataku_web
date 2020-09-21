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
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class AdminPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  // componentDidMount() {
  //   this.setState({ loading: true });

  //   this.props.firebase.users().on('value', snapshot => {
  //     const usersObject = snapshot.val();

  //     const usersList = Object.keys(usersObject).map(key => ({
  //       ...usersObject[key],
  //       uid: key,
  //     }));

  //     this.setState({
  //       users: usersList,
  //       loading: false,
  //     });
  //   });
  // }

  // componentWillUnmount() {
  //   this.props.firebase.users().off();
  // }

  render() {
    return (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            User List
          </Typography>
          <Switch>
            <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
            <Route exact path={ROUTES.ADMIN} component={UserList} />
          </Switch>
        </Paper>
      </Grid>
    );
  }
}

/////////////////////////////////////////// ALL DATA
class UserListBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));
      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleDelete = propSample =>
    this.props.firebase.db.ref('users/' + propSample).remove();


  render() {
    const { users, loading } = this.state;
    // console.log(users);
    return (
      <div>
        {loading && <Typography>Loading...</Typography>}
        <h2>Users</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Kabupaten</TableCell>
              <TableCell>Kecamatan</TableCell>
              <TableCell>Desa Kelurahan</TableCell>
              <TableCell>Puskesmas</TableCell>
              <TableCell>Role</TableCell>
              <TableCell colSpan={2}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && !!users && users.map((el, key) =>
              <TableRow key={key}>
                <TableCell>{el.userName}</TableCell>
                <TableCell>{el.userKabupaten}</TableCell>
                <TableCell>{el.userKecamatan}</TableCell>
                <TableCell>{el.userDesaKelurahan}</TableCell>
                <TableCell>{el.userPuskesmas}</TableCell>
                <TableCell>{el.userRole}</TableCell>
                <TableCell>0
                  <Button component={Link}
                    to={{
                      pathname: `${ROUTES.ADMIN}/${el.uid}`,
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
      </div>
    );
  }

}

/////////////////////////////////////////// UBAH DATA
class UserItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: null,
      userName: '',
      userRole: '',

      nipUser: '0000',
      open: false,
      kacab: '',
      roles: [],
      selectKacab: '',
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }
    this.setState({ loading: true });
    this.props.firebase
      .user(this.props.match.params.id)
      .on('value', snapshot => {
        this.setState({
          user: snapshot.val(),
          namaUser: snapshot.val().namaUser,
          userRole: snapshot.val().userRole,
          loading: false,
        });
        // console.log(snapshot.val());
      });
    // console.log(this.props);
    // console.log(this.state);
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  onChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleSubmit = () => {
    // console.log(this.state);
    this.setState({ open: false });
    this.props.firebase.db.ref('users/' + this.props.match.params.id).update({
      userRole: this.state.userRole,
    })
  }


  render() {
    // console.log(this.state);
    // console.log(this.props.match.params.id)

    const { user, loading, userName, userRole } = this.state;
    const isInvalid = userRole === ''
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Ubah Role
        </Button>{' '}
        <Button>
          <Link
            to={{
              pathname: `${ROUTES.ADMIN}`,
            }}
          >
            BACK
          </Link>
        </Button>
        {loading && <div>Loading ...</div>}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              {/* <TableCell>Action</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && !!user &&
              <TableRow>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.userRole}</TableCell>
                {/* <TableCell>
                  <Button variant="text" color="secondary" onClick={() => this.setState({ open: true })}>
                    Ubah Role
                  </Button>
                </TableCell> */}
              </TableRow>
            }
          </TableBody>
        </Table>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Ubah Data User</DialogTitle>
          <DialogContent>
            <FormControl style={{ marginTop: 15 }} variant="standard">
              <InputLabel htmlFor="roles">Role</InputLabel>{" "}
              <Select
                value={userRole}
                onChange={this.onChange('userRole')}
                style={{ width: 400 }}
                name="userRole"
              >
                <MenuItem value="ROLELESS">ROLELESS</MenuItem>
                <MenuItem value="Surveyor">Surveyor</MenuItem>
              </Select>
            </FormControl>
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
    );
  }

}

const condition = authUser => authUser && authUser.userRole.includes(ROLES.SYSTEMADMIN);

const UserList = withFirebase(UserListBase);
const UserItem = withFirebase(UserItemBase);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
