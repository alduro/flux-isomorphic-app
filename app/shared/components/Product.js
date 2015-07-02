'use strict';

import React from 'react';

class Product extends React.Component {

  constructor() {
    super();

    this.state = {
      added: false
    };
  }

  addToCart(e) {
    if(!this.state.added) {
      // add
      $.publish('cart.added', this.props.data);
    }
    else {
      // remove
      $.publish('cart.removed', this.props.data.name);
    }

    this.setState({
      added: !this.state.added
    });

  }

  render() {
    var data = this.props.data;
    return (
      <div className="thumbnail">
        <img className="product__photo" src={require('products/' + data.image)} alt="product image" />
        <div className="caption clearfix">
          <div className="product__name-wrapper">
            <h3>{data.name}</h3>
            <h3>{data.name_cn}</h3>
          </div>
          <div className="product__description">{data.description}</div>
          <div className="product__price-discounted">${data.discount}</div>
          <div className="product__price"> ${data.price}</div>
          <div className="product__button-wrap">
            <button className={this.state.added ? 'btn btn-danger' : 'btn btn-primary'} onClick={this.addToCart}>
              {this.state.added ? 'Remove' : 'Add To Cart'}
            </button>
          </div>
        </div>
      </div>
    );
  }

}

export default Product;
