'use strict';

import React from 'react';
import Product from './Product';

class ProductsList extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() {}

  render() {
    const products = this.props.data.map( (product) => {
      return (
        <div className="col-lg-4 col-md-4" key={product._id} >
          <div className="product__item">
            <Product data={product}/>
          </div>
        </div>
      )
    });

    return (
      <span>{products}</span>
    );
  }

}

export default ProductsList;
