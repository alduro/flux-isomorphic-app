'use strict';

import { Actions } from 'flummox';
import ApiUtils from '../utils/ApiUtils';

class RestaurantActions extends Actions {

  getRestaurantInfo() {
    return ApiUtils.get('api/');
  }

}

export default RestaurantActions;
