'use strict';

import { Store } from 'flummox';

const Status = {
  Loading: 'loading',
  Ok: 'ok',
};

class RestaurantStore extends Store {

  constructor(flux) {
    super();
    this.flux = flux;
    this.state = {};

    const actions = flux.getActions('restaurants');
    this.registerAsync(actions.getRestaurantInfo, this._handleRequest, this._handleResult, this._handleResult);
  }

  _handleRequest (params = {}) {
    this.setState({ status: Status.Loading, params });
  }

  _handleResult (res) {
    if (res.status !== 200) return;
    this.setState({ status: Status.Ok, restaurant: res.data });
  }

  getStatus () {
    return this.state.status || Status.Loading;
  }

  getRestaurant() {
    return this.state.restaurant || [];
  }

  static serialize (state) {
    return JSON.stringify(state);
  }

  static deserialize (state) {
    return JSON.parse(state);
  }


}

export default RestaurantStore;
