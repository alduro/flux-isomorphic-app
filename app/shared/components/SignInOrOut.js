import React from 'react';
import {Link} from 'react-router';
// var Link = Router.Link;
import AuthStore from '../stores/AuthStore';
import AuthActions from '../actions/AuthActions';
import connectToStores from 'flummox/connect';

export default class SignInOrOut extends React.Component {

  constructor() {
    super();
    this.state = {
      isSignedIn: false,
      isSigningOut: false,
      error: ''
    }
  }

  handleSignOut(e) {
    e.preventDefault();
    AuthActions.signOut();
  }

  render() {
    if (!this.state.isSignedIn) {
      return <Link to="signin">Sign in</Link>;
    }

    if (this.state.isSigningOut) {
      return <span>Signing out...</span>;
    }

    return <a href="" onClick={this.handleSignOut}>Sign out</a>;
  }

}

SignInOrOut = connectToStores(SignInOrOut, {
  auth: (store, props) => {
    return {
      isSignedIn: store.isSignedIn(),
      isSigningOut: store.isSigningOut(),
      error: store.error()
    }
  }
});
