'use strict';

import { Store } from 'flummox';

const Status = {
  Loading: 'loading',
  Ok: 'ok',
};

class AuthStore extends Store {

  constructor(flux) {
    super();

    this.flux = flux;
    this.state = {};

    const actions = flux.getActions('auth');
    this.registerAsync(actions.signIn, this._handleRequest, this._signInSuccess, this._signInError);
    this.registerAsync(actions.signOut, this._handleRequest, this._signOutSuccess, this._signOutError);
    this.registerAsync(actions.signUp, this.__handleRequest, this._signUpSuccess, this._signUpError);
  }

  _handleRequest (params = {}) {
    this.setState({ status: Status.Loading, params });
  }

  _signInSuccess(res) {
    this.setState({
      user: res.data,
      token: res.data.token,
      isSignedIn: true,
      isSigningIn: false,
      status: Status.Ok,
    });
  }

  _signInError(res) {
    this.setState({
      error: res.data.error,
      status: Status.Ok
    });
  }

  _signOutSuccess(res) {
    this.setState({
      user: res.data,
      token: res.data.token,
      isSignedIn: false,
      isSigningIn: false,
      error: '',
      status: Status.Ok
    });
  }

  _signOutError(res) {
    this.setState({
      error: res.err.message,
      status: Status.Ok
    });
  }

  _signUpSuccess(res) {
    this.setState({
      user: res.data,
      status: Status.Ok
    });
  }

  _signUpError(res) {
    this.setState({
      error: res.err.message,
      status: Status.OK
    });
  }

  getUser() {
    return this.state.user || {};
  }

  isSignedIn() {
    return this.state.isSignedIn || false;
  }

  isSigningIn() {
    return this.state.isSigningIn || false;
  }

  isSigningOut() {
    return this.state.isSigningOut || false;
  }

  getToken() {
    return this.state.token || '';
  }

  getError() {
    return this.state.error || '';
  }

  getStatus () {
    return this.state.status || Status.Loading;
  }


  static serialize (state) {
    return JSON.stringify(state);
  }

  static deserialize (state) {
    return JSON.parse(state);
  }


}

export default AuthStore;
