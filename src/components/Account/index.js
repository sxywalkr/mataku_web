import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
// import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', margin: 10}}>
        <Paper style={{padding: 10, width: 300}}>
          <Typography variant="h4" gutterBottom>
            Account: {authUser.email}
          </Typography>
          <PasswordForgetForm />
          <PasswordChangeForm />
        </Paper>
      </div>   
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);