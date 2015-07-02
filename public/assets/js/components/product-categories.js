
var ProductCategories = React.createClass({
    render: function() {

        var categories = this.props.data.map(function(category) {
          return (
              <div className="product__category">
                <span className="category_title">{category.name}</span>
                  <div className="row">
                    <ProductsList data={category.items} />
                  </div>
              </div>
            )
        });

        return (
          <div>{categories}</div>
        );
    }
});
