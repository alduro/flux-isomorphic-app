var mongoose = require('mongoose');

var itemSchema = mongoose.Schema({
	name   : String,
	name_cn : String,
	sku : String,
	_category : mongoose.Schema.ObjectId,
	price  : Number,
	discount : Number,
	description : String,
	image  : String,

	reserve : Number,
	quantity_available : Number
});

module.exports = mongoose.model('Item', itemSchema);