'use strict';

import { Flummox } from 'flummox';
import RestaurantActions from './actions/RestaurantActions';
import RestaurantStore from './stores/RestaurantStore';
import AuthActions from './actions/AuthActions';
import AuthStore from './stores/AuthStore';

class Flux extends Flummox {
  constructor (opts = {}) {
    super();
    this.opts = opts;

    this.createActions('restaurants', RestaurantActions, this);
    this.createActions('auth', AuthActions, this);

    this.createStore('restaurants', RestaurantStore, this);
    this.createStore('auth', AuthStore, this);

    this.on('dispatch', function (payload) {
      console.log('dispatching -> ', payload);
    });
    this.on('error', function (err) {
      console.error(err.stack);
    });
  }

  clientSide (cb, ...args) {
    if (this.opts.serverSide) return false;
    if (cb) cb(...args);
    return true;
  }

  serverSide (cb, ...args) {
    if (!this.opts.serverSide) return false;
    if (cb) cb(...args);
    return true;
  }
}

export default Flux;
