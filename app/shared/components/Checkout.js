/** @jsx React.DOM */

var Form = React.createClass({

	// <div className="checkbox">
	//     <label>
	//       <input type="checkbox" id="orderType" /> This is a Dine-in order (Subject to availability and 10% service charge)
	//     </label>
	// </div>

	render: function(){
		return (
			<form>
			  <div className="form-group">
			    <label for="name">Name</label>
			    <input type="text" className="form-control" id="name" placeholder="Your Name"/>
			  </div>
			  <div className="form-group">
			    <label for="email">Email</label>
			    <input type="email" className="form-control" id="email" placeholder="Your Email"/>
			  </div>
			  
			  <div className="form-group">
			    <label for="email">Confirm Email</label>
			    <input type="email" className="form-control" id="email2" placeholder="Confirm Email"/>
			  </div>

			  <div className="form-group">
			    <label for="phone">Phone</label>
			    <input type="text" className="form-control" id="phone" placeholder="Your Phone #"/>
			  </div>

			  <div className="form-group">
			    <label for="phone">Remarks</label>
			    <input type="textfield" className="form-control" ref="customer_remarks" id="remarks" placeholder="(Optional) e.g. Decaf, Soy Milk, etc" />
			  </div>

			  <div className="pickup_time">
			  	<label>When would you like to pickup your food?</label> <br/>
				  	<input type="radio" name="pickup_time" value="1" id="time1" /> <label htmlFor="time1">Noon</label> <br/>
				  	<input type="radio" name="pickup_time" value="2" id="time2" /> <label htmlFor="time2">12:15 p.m.</label> <br/>
				  	<input type="radio" name="pickup_time" value="3" id="time3" /> <label htmlFor="time3">12:30 p.m.</label> <br/>
				  	<input type="radio" name="pickup_time" value="4" id="time4" /> <label htmlFor="time4">12:45 p.m.</label> <br/>
				  	<input type="radio" name="pickup_time" value="5" id="time5" /> <label htmlFor="time5">1:00 p.m. or later</label> <br/>
			  </div>

			</form>
			)
	}
});