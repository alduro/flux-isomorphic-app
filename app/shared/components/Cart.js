/** @jsx React.DOM */

var Cart = React.createClass({

    getInitialState: function() {
      // also subscribe to product events here
      $.subscribe('cart.added', this.addItem);
      $.subscribe('cart.removed', this.removeItem);
      // $.subscribe('customer.update', this.updateCustomer);

      return {
        items: [],
        items2: {},
        total: 0,
        currency: '$',
        // name: '',
        // phone: '',
        // email: '',
        // remarks: '',
        // orderType: 0,
        // pickup_time: ''
      };
    },

    // updateCustomer: function(e, data) {
    //   this.setState({
    //     name: data.name,
    //     phone: data.phone,
    //     email: data.email,
    //     remarks: data.remarks,
    //     orderType: data.orderType,
    //     pickup_time: data.pickup_time
    //   });
    // },

    addItem: function(e, item) {
      this.state.items.push(item);
      this.forceUpdate();

      $('.cart_count').html(this.state.items.length);

      // if (item.id in this.state.items2){
      //   this.state.items2[item.name] += 1;
      // } else {
      //   this.state.items2[item.name] = 1;
      // }

      // this.forceUpdate();

      // console.log(this.state.items2);

      this.countTotal();
    },

    removeItem: function(e, itemId) {
      var itemIndexInArray;

      this.state.items.some(function(item, index) {
        if(item.id === itemId) {
          itemIndexInArray = index;
          return true;
        }
      });

      this.state.items.splice(itemIndexInArray, 1);
      
      // if (itemId in this.state.items2){
      //   this.state.items2[itemId] -= 1;
      //   if(!this.state.items2[itemId]){
      //     delete this.state.items2[itemId];
      //   }
      // }      
      // console.log(this.state.items2);

      this.forceUpdate();

      this.countTotal();
      $('.cart_count').html(this.state.items.length);
    },

    countTotal: function() {
      var total = 0;

      this.state.items.forEach(function(item, index) {
        total += item.price;
      });

      this.setState({
        total: total
      })
    },

    checkout2: function(e) {
      e.preventDefault();
      var email1 = $('#email').val();
      var email2 = $('#email2').val();
      var pickup_time = $('input[name=pickup_time]:checked').val();

      if(email1 != email2 || email1 == ""){
        alert('Please enter matching emails!');
      } else if($('#name').val() == "" || $('#phone').val() == ""){
        alert('Please fill in your name and phone number!');
      } else if(!pickup_time){
        alert('Please choose a timeslot to pick up your order!');
      } else {

        // var orderType = $('#orderType').prop('checked') ? 1 : 0;
        var orderType = 0;
        

        var paypalString = "";

        var paypalString = this.state.items.map(function(item, index){
          return '<input type="hidden" name="item_name_'+ (index+1) +'" value="'+ item.name +'"/><input type="hidden" name="amount_'+ (index+1) +'" value="'+ item.price +'"/>';
        })
        paypalString = paypalString.join("");
        paypalString += '<input type="hidden" name="custom" value="'+ $('#uid').val() + "|" + $('#name').val() + "|"+ $('#phone').val() + "|" +$('#email').val() + "|"+ $('#remarks').val()+'|'+orderType+'|'+pickup_time+'"/>';
        // paypalString += '<input type="hidden" name="first_name" value="'+ $('#name').val()+'"/>';
        // paypalString += '<input type="hidden" name="contact_phone" value="'+ $('#phone').val()+'"/>';
        // paypalString += '<input type="hidden" name="payer_email" value="'+ $('#email').val()+'"/>';

        $('.paypalForm').append(paypalString);

        $('.paypalForm').submit();
      }
    },

    // checkout: function() {
    //   if(this.state.items.length){

    //     var orderType = $('#orderType').prop('checked') ? 1 : 0;

    //     $.ajax({
    //       method: 'POST',
    //       url: 'http://localhost:3000/api/orders',
    //       dataType: 'json',
    //       data: {
    //         name: $('#name').val(),
    //         email: $('#email').val(),
    //         amount: this.state.total,
    //         items: this.state.items,
    //         phone: $('#phone').val(),
    //         userId: '123',
    //         orderType: orderType
    //       },
    //       success: function(data){
    //         // console.log(data);
    //         console.log(data);
    //             alert(data.message + "!");
            
    //       }
    //     });

    //   } else {
    //     alert('Cart is empty!');
    //   }
    // },

    render: function() {

        var items = this.state.items.map(function(item) {
            return (
              <li key={item.id} className="cart-item">
                <span className="cart-item__name">{item.name}</span>
                <span className="cart-item__price">${item.price}</span>

                <span> x 1</span>
              </li>
            )
        });

        var body = (
          <ul>
            {items}
          </ul>
        );

        var checkoutBtn = (
          <button type="button" className="btn-checkout btn btn-primary" onClick={this.checkout}>Place Order</button>
        );

        var empty = <div className="alert alert-info">Cart is empty</div>;

        return (
          <div className="panel panel-default">
            <div className="panel-body">
              {items.length > 0 ? body : empty}
              <div className="cart__total">Total: $<span className="totalAmount">{this.state.total}</span></div>
            </div>

            <div className="checkOutBtn">
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" className="paypalForm">
                <input type="hidden" name="cmd" value="_cart"/>
                <input type="hidden" name="upload" value="1"/>
                <input type="hidden" name="business" value="info@meego.co"/>
                <input type="hidden" name="currency_code" value="HKD"/>
                <input type="hidden" name="lc" value="US" />
                <input type="hidden" name="notify_url" value={window.location.origin+ "/api/orders/notify"} />
                <input type="hidden" name="return" value={window.location.origin} />
                <input type="hidden" name="cancel_return" value={window.location.origin} />

                <input type="image" id="PaypalcheckOutBtn" onClick={this.checkout2} src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/checkout-logo-large.png" name="submit" alt="Make payments with PayPal - it's fast, free and secure!"/>
              </form>
            </div>
          </div>
        );
    }
});
