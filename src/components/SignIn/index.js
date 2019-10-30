import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const SignInPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 10 }}>
    <Paper style={{ padding: 10, width: 300 }}>
      <Typography variant="h4" gutterBottom>
        Sign In
      </Typography>
      <SignInForm />
      {/* <PasswordForgetLink /> */}
      {/* <SignUpLink /> */}
    </Paper>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
  isLoading: false,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.setState({ isLoading: true });
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        // console.log(this.state)
        this.setState({ isLoading: false });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
        this.setState({ isLoading: false });
      });

    // console.log(this.state)
    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
    // console.log(this.state)
  };

  render() {
    const { email, password, error, isLoading } = this.state;

    const isInvalid = password === '' || email === '' || isLoading === true;

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="email"
          label="Email"
          // value={email}
          onChange={this.onChange}
          style={{ width: "100%", marginBottom: 10 }}
          variant="outlined"
        />
        <TextField
          id="password"
          label="Password"
          // value={password}
          onChange={this.onChange}
          style={{ width: "100%", marginBottom: 10 }}
          type="password"
          variant="outlined"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Sign In
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };