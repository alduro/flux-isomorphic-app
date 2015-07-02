var moment = require('moment');
var mongoose = require('mongoose');

// var User = require('../models/user.js');

var orderSchema = mongoose.Schema({
	userId : String,
	name : String,
	phone : String,
	email: String,
	remarks: String,
	// _user : { type: mongoose.Schema.ObjectId, ref: 'User'},

	type: {type: Number, default: 0}, //1: Walk-in, 0: Takeout

	items : [{
		item_id: String,
		name: String,
		code: String,
		price: Number, 
		quantity: {type: Number, default: 1}
	}],
	
	orderNumber : String,

	restaurant : {name: String, image: String},

	amount : Number,
	status : Number, //1: Pending, 2: Ack, 4: Completed
	createdAt : Date,
	acknowledgedAt : Date,
	completedAt : Date,
	updatedAt : Date,

	pickup_time : String,

	//Paypal
	paypal_fee : Number

});

orderSchema.pre('save', function(next){

	if(this.status === 2){ //Pending to Ack
		this.acknowledgedAt = moment().utcOffset('8');
	} else if(this.status === 4){ //Act to Complete
		this.completedAt = moment().utcOffset('8');
	}

	this.updatedAt = moment().utcOffset('8');
	if(!this.createdAt)
		this.createdAt = moment().utcOffset('8');
	next();
});

module.exports = mongoose.model('Order', orderSchema);