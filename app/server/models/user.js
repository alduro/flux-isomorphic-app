import mongoose from 'mongoose';
let Schema  = mongoose.Schema;
import crypto from 'crypto';
import config from '../env/config';

// user schema
let UserSchema = new mongoose.Schema({

	email: String,
	name: String,
	password: {
		type: String,
		required: true
	},

	type: {type: Number, default: 1}, //1: User, 2: Merchant, 3: Admin
	phone: String,
	is_restaurant: {type: Boolean, default: false},
	restaurant_notification_email: String,

	reset_token: String,
	reset_at: Date,
	token: String,
	facebook_id: String,
	facebook_access_token: String,
	facebook_refresh_token: String,
	google_id: String,
	google_access_token: String,
	google_refresh_token: String,

	created: {type: Date, default: Date.now}

});

UserSchema.methods.authenticate = function(plain){
	return this.constructor.encryptPassword(plain) == this.password_sha256;
};

//UserSchema.methods.isEnabled = function() {
//	return this.enabled;
//};

UserSchema.statics.encryptPassword = function (str) {
	return crypto.createHmac('sha256', config.salt).update(str).digest('hex');
};

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.verifyPassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

module.exports = mongoose.model('User', UserSchema);


