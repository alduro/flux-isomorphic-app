'use strict';

import React from 'react';
import ProductCategories from './ProductCategories';
import connectToStores from 'flummox/connect';

class Restaurant extends React.Component {

  constructor(props) {
    super(props);
  }

  static async willTransitionTo(transition, params, query, done) {
    debugger;
    const { flux } = transition.context;

    flux.clientSide(done);

    const auth = flux.getStore('auth');

    if (!auth.isSignedIn()) {
      transition.redirect('signin');
    }

    flux.serverSide(done);
  }

  componentDidMount() {
    const restaurantActions = this.props.flux.getActions('restaurants');
    restaurantActions.getRestaurantInfo();
  }

  render() {
    const {restaurant} = this.props;
    return (
      <div className='container'>
        <div className='restaurant_description'>
          <h2 style={{ color: '#93573D' }}>Cafe Habitu</h2><span style={{ color: '#FC571F' }}>at Elements Mall</span><br/>
                  <span style={{ color: '#FC571F' }}>Shop 1001, 1 Austin Road West, Kowloon Station<br/>Tel: 2196-8466 </span>
        </div>
        <div className='row'>
          <div className='col-md-12'>
            <ProductCategories data={restaurant}/>
            <div className='product__category'>
              <span className='category_title' id='complementary'>Complementary</span>
              <div className='row'>
                <div className='col-lg-4 col-md-4'>
                  <div className='product__item'>
                    <div className='thumbnail'>
                      <img className='product__photo' src='assets/products/cake.jpg' />
                      <div className='caption clearfix'>
                        <div className='product__name-wrapper'>
                          <h3>Quintessential Cake</h3>
                          <h3>精選蛋糕</h3>
                        </div>
                        <div className='product__description'>FREE with any Meego purchases</div>
                        <div className='product__price-discounted'>FREE!</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 style={{ color: '#FC571F' }}>Enjoy your lunch!</h3>
          </div>
        </div>
      </div>
    );
  }

}

Restaurant = connectToStores(Restaurant, {
  restaurants: (store, props) => {
    return {
      restaurant: store.getRestaurant()
    }
  }
});

export default Restaurant;
