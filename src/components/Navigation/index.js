import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROLES from '../../constants/roles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = ({authUser}) => (
  <div style={{flexGrow: 1}}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{marginRight: 20}} >
          Mataku
        </Typography>
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.HOME}>Home</Button>
        {/* <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.ACCOUNT}>Account</Button> */}
        {!!authUser.userRole && authUser.userRole.includes(ROLES.CS) && (
          <div>
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.HARIANCS}>Harian CS</Button>
          </div>
        )}
        {!!authUser.userRole && authUser.userRole.includes(ROLES.ADMIN) && (
          <div>
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.DATABASEUSER}>Database User</Button>
          </div>
        )}
        {!!authUser.userRole && authUser.userRole.includes(ROLES.SYSTEMADMIN) && (
          <div>
            {/* <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.PRODUK}>Produks</Button> */}
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.ADMIN}>Users</Button>
          </div>
        )}
        {!!authUser.userRole && authUser.userRole.includes(ROLES.SUPERADMIN) && (
          <div>
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.PRODUK}>Produks</Button>
            <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.ADMIN}>Users</Button>
          </div>
        )}
        <SignOutButton />
      </Toolbar>
    </AppBar>
  </div>
);

const NavigationNonAuth = () => (
  <div style={{flexGrow: 1}}>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" color="inherit" style={{marginRight: 20}} >
          Mataku
        </Typography>
        <Button color="inherit" style={{marginRight: 5}} component={Link} to={ROUTES.SIGN_IN}>Sign In</Button>
        {/* <SignOutButton /> */}
      </Toolbar>
    </AppBar>
  </div>
);

export default Navigation;
