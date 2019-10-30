import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          id="passwordOne"
          label="New Password"
          // value={passwordOne}
          onChange={this.onChange}
          type="password"
          style={{width: "100%", marginBottom: 10, marginTop: 10}}
          variant="outlined"
        />
        <TextField
          id="passwordTwo"
          label="Confirm New Password"
          // value={passwordTwo}
          onChange={this.onChange}
          type="password"
          style={{width: "100%", marginBottom: 10}}
          variant="outlined"
        />
        <Button variant="contained" color="primary" disabled={isInvalid} type="submit">
          Submit Password Baru
        </Button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

export default withFirebase(PasswordChangeForm);