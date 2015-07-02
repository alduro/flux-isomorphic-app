var express = require('express');
var router = express.Router();

var RestaurantController = require('../controllers/restaurant');
var ItemsController = require('../controllers/item');
var OrdersController = require('../controllers/order');

module.exports = function(passport){

	/* GET Home Page */
	// router.get('/', function(req, res){
	// 	req.params.restaurant_name = "Cafe Habitu";
	// 	RestaurantController.getRestaurantMenuJSON(req, function(restaurant){
	// 		res.render('shop', {'restaurant_data': JSON.parse(JSON.stringify(restaurant)) });
	// 	});
	// });

	router.get('/profile', isAuthenticated, function(req, res){
		res.render('profile', {'user': JSON.parse(JSON.stringify(req.user))});
	});

	router.get('/faq', function(req, res) {
		res.render('faq');
	});

	router.get('/my-order', function(req, res) {
		res.render('my_order');
	});

	router.get('/orders', isAuthenticated, function(req, res) {
		if(req.user.is_restaurant){
			res.render('orders');
		} else {
			res.redirect('/');
		}
	});

	router.get('/allOrders', isAuthenticated, function(req, res) {
		if(req.user.is_restaurant){
			res.render('orders_all');
		} else {
			res.redirect('/');
		}
	});

	return router;
}





