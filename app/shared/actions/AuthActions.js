'use strict';

import { Actions } from 'flummox';
import ApiUtils from '../utils/ApiUtils';

class AuthActions extends Actions {

  signIn(payload) {
    return ApiUtils.post('/api/signin', payload);
  }

  signOut() {
    return ApiUtils.post('/api/signout');
  }

  singUp(payload) {
    return ApiUtils.post('/api/signup', payload);
  }

}

export default AuthActions;
