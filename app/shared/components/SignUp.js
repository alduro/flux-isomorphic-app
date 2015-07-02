import React from 'react/addons';
import AuthActions from '../actions/AuthActions';
import connectToStores from 'flummox/connect';

export default class SignUp extends React.Component {

  constructor() {
    super()
    this.state = {
      email: '',
      password: '',
      extra: ''
    };
  }

  signup(e) {
    e.preventDefault();
    AuthActions.signup(this.state.email, this.state.password, this.state.extra)
      .catch((err) => {
        alert("There's an error logging in");
        console.log("Error logging in", err);
      });
  }

  renderError() {
    var error = this.state.error;
    if (!error) {
      return null;
    }

    var text;
    if (error.name === 'BadCredentials') {
      text = 'Wrong username or password';
    }
    else {
      text = 'An error occured while signing up';
    }

    return <p style={{color: 'red'}}>{text}</p>;
  }

  render() {
    return (
      <div className="login jumbotron center-block">
        <h1>Signup</h1>
        <form role="form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" id="username" placeholder="Username" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" ref="password" placeholder="Password" />
        </div>
        <div className="form-group">
          <label htmlFor="extra">Extra</label>
          <input type="text" className="form-control" id="password" ref="password" placeholder="Some extra information" />
        </div>
        <button type="submit" className="btn btn-default" onClick={this.signup}>Submit</button>
      </form>
      {this.renderError()}
    </div>
    );
  }
}

SignUp = connectToStores(SignUp, {
  auth: (store, props) => {
    return {
      error: store.error()
    }
  }
});
