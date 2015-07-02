
'use strict';

import React from 'react';
import ProductsList from './ProductsList';

class ProductCategories extends React.Component {

  constructor() {
    super();
  }

  componentDidMount() { }

  render() {
    let categories = 'No Categories';
    if (this.props.data && this.props.data.categories && this.props.data.categories.length > 0) {
      categories = this.props.data.categories.map( (category) => {
        return (
          <div className="product__category" key={category._id}>
            <span className="category_title">{category.name}</span>
            <div key={category._id} className="row">
              <ProductsList data={category.items}/>
            </div>
          </div>
        )
      });
    }

    return (
      <div>{categories}</div>
    );

  }

}

export default ProductCategories;
