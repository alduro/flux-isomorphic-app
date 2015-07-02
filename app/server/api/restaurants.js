'use strict';

import Category from '../models/category.js';
import Restaurant from '../models/restaurant.js';
import Item from '../models/item.js';

export default function (router) {

  router.route('/')
    .get( (req, res, next) => {
      let restaurant_name = 'Cafe Habitu'; // BY default. Change this !!!
      Restaurant
       .findOne({ 'name' : restaurant_name})
       .populate('categories')
       .exec( (err, restaurant) => {
         Item.populate(restaurant.categories, {path : 'items'}, (err, data) => {
           if(err) {
             res(err);
             res.status(400).json({success: false, message: err});
           }
           res.status(200).json(restaurant);
         });
       });
      //req.params.restaurant_name = "Cafe Habitu";
    });

  router.route('/restaurants')
    .post( (req, res, next) => {
      let restaurant = new Restaurant();

      restaurant.name = req.body.name;
      restaurant.image = req.body.image;

      // console.log(req.body.categories);
      restaurant.categories = [];

      for (let i in req.body.categories) {
        let category = new Category();
        category.name = req.body.categories[i];
        restaurant.categories.push(category);
      }

      restaurant.save( (err) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json({message: "Restaurant Saved", data: restaurant});
      });
    })
    .get( (req, res) => {
      Restaurant.find( (err, restaurants) => {
        if (err) {
          res.send(err);
        }

        res.status(200).json(restaurants);
      });
    });

  router.route('/restaurants/:restaurant_id')
    .get((req, res) => {
      Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {
        if (err)
          res.send(err);

        res.json(restaurant);
      });
    })
    .put((req, res) => {
      Restaurant.findById(req.params.restaurant_id, function (err, restaurant) {
        if (err)
          res.send(err);

        if (req.body.name)
          restaurant.name = req.body.name;

        if (req.body.image)
          restaurant.image = req.body.image;

        if (req.body.categories.length) {
          restaurant.categories = [];

          for (let i in req.body.categories) {
            let category = new Category();
            category.name = req.body.categories[i];
            restaurant.categories.push(category);
          }
        }

        restaurant.save(function (err) {
          if (err) {
            res.send(err);
          }
          res.json(restaurant);
        });
      });
    })
    .delete((req, res) => {
      Restaurant.findByIdAndRemove(req.params.restaurant_id, (err, restaurant) => {
        if (err)
          res.send(err);
        res.json({message: "Restaurant Removed"});
      });
    });

  router.route('/restaurant/:restaurant_id')
    .post((req, res) => {
      Restaurant.findById(req.params.restaurant_id, (err, restaurant) => {

        let item = new Item();

        item.name = req.body.item_name;
        item.image = req.body.item_image;
        item.price = req.body.item_price;

        restaurant.items.push(item);

        restaurant.save((err) => {
          if (err)
            res.send(err);
          res.json(restaurant);
        });
      });
    });

  router.route('/categories/:restaurant_name')
    .get((req, res) => {
      Restaurant
        .findOne({'name': req.params.restaurant_name})
        .populate('categories')
        .exec(function (err, restaurant) {
          Item.populate(restaurant.categories, {path: 'items'}, function (err, data) {
            if (err)
              res.send(err);

            res.json(restaurant);
          });
        });
    });

}
