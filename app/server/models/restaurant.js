import mongoose from 'mongoose';
import Category from '../models/category';

let restaurantSchema = mongoose.Schema({
	name   : String,
	image  : String,
	banner_image: String,
	description: String,
	categories  : [{type: mongoose.Schema.ObjectId, ref: 'Category'}]

});

module.exports = mongoose.model('Restaurant', restaurantSchema);
