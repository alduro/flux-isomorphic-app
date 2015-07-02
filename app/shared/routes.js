'use strict';

import React from 'react'; /* eslint no-unused-vars:0 */
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import App from './components/App';
import Restaurant from './components/Restaurant';
import SignIn from './components/SignIn';
import SignInOrOut from './components/SignInOrOut';
import SignUp from './components/SignUp';
import NotFound from './components/Notfound';

export default (
  <Route name="app" handler={App}>
    <Route path="/"       name="restaurant"  handler={Restaurant}/>
    <Route path="/signin" name="signin"      handler={SignIn} />
    <Route path="/signup" name="signup"      handler={SignUp} />
    <Route name="signinorout"                handler={SignInOrOut} />
    <NotFoundRoute        name="not-found"   handler={NotFound} />
  </Route>
);