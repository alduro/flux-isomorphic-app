/** @jsx React.DOM */

var ProductsList = React.createClass({
    render: function() {
        var products = this.props.data.map(function(product) {
            return (
              <div className="col-lg-4 col-md-4">
                <div className="product__item" key={product.id}>
                  <Product data={product} />
                </div>
              </div>
            )
        });

        return (
          <span>{products}</span>
        );
    }
});
