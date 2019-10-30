import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <Grid style={{ flex: 1, margin: 10 }} item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Typography variant="h5" gutterBottom>
            Selamat datang di aplikasi Mataku
           </Typography>
          <Typography variant="h4" gutterBottom>
            Halo, {authUser.userName}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Aplikasi ini untuk mengatur data user.
          </Typography>
        </Paper>
      </Grid>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);
