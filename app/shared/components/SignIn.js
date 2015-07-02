import React from 'react';
// import AuthStore from '../stores/AuthStore';
// import AuthActions from '../actions/AuthActions';
import connectToStores from 'flummox/connect';

class SignIn extends React.Component {

  constructor() {
    super();
    // this.handleSignIn = this.handleSignIn.bind(this);
  }

  componentDidMount() {
    this.authActions = this.props.flux.getActions('auth');
  }

  handleGotoForgotPasswordPage(e) {
    this.transitionTo('forgot-password');
  }

  renderButton() {
    let disabled;
    let text = 'Sign in';

    if (this.props.isSigningIn) {
      disabled = true;
      text = 'Signing in...';
    }

    return (
      <button
        type="submit"
        onClick={this.handleSignIn}
        disabled={disabled}>
        {text}
      </button>
    );
  }

  handleSignIn = (e) => {
    e.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    this.authActions.signIn({
      email: email,
      password: password
    });
  }

  renderError() {
    var error = this.props.error;
    if (!error) {
      return null;
    }

    var text;
    if (error.name === 'BadCredentials') {
      text = 'Wrong username or password';
    }
    else {
      text = 'An error occured while signing in';
    }

    return <p style={{color: 'red'}}>{text}</p>;
  }

  render() {
    return (
      <div>
        <h1>Sign in</h1>
        <form>
          <p><input ref="email" name="email" placeholder="email" defaultValue="joe@example.com"/></p>
          <p>
            <input ref="password" name="password" type="password" placeholder="password"/>
            {' (hint: password1)'}
          </p>
          <p>{this.renderButton()}</p>
        </form>
        {this.renderError()}
      </div>
    );
  }

}

SignIn = connectToStores(SignIn, {
  auth: (store, props) => {
    return {
      isSigningIn: store.isSigningIn(),
      error: store.getError(),
      isSignedIn: store.isSignedIn()
    }
  }
});

export default SignIn;