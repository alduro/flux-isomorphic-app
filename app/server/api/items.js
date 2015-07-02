'use strict';

import Item from '../models/item';

export default function (router) {

  router.route('/items')
    .post( (req, res) => {
      let item = new Item();

      if (!req.body.name) {
        res.json({message: "Missing Name"});
      } else {

        item.name = req.body.name;
        item.image = req.body.image;
        item.itemCode = req.body.itemCode;
        // item.restaurantId = req.body.restaurantId;
        item._category = req.body.category;
        item.quantity_available = req.body.quantity_available;
        item.price = req.body.price;

        item.save( (err) => {
          if (err)
            res.send(err);
          res.json({message: "Item Saved", data: item});
        });
      }
    })
    .get( (req, res) => {
      Item.find( (err, items) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json(items);
      });
    });

  router.route('/items/:item_id')
    .get( (req, res) => {
      Item.findById(req.params.item_id, (err, item) => {
        if (err) {
          res.status(400).send(err);
        }
        res.status(200).json(item);
      });
    })
    .put( (req, res) => {
      Item.findById(req.params.item_id, (err, item) => {
        if (err) {
          res.send(err);
        }
        item.name = req.body.name;
        item.image = req.body.image;
        item.price = req.body.price;
        item._category = req.body.category;
        item.itemCode = req.body.itemCode;
        item.quantity_available = req.body.quantity_available;
        item.save( (err) => {
          if (err) {
            res.status(400).send(err);
          }
          res.status(200).json(item);
        });
      });
    })
    .delete( (req, res) => {
      Item.findByIdAndRemove(req.params.item_id, (err, item) => {
        if (err)
          res.send(err);
        res.status(200).json({message: "Item Removed"});
      });
    });

  router.route('/restaurant/:restaurant_id/items')
    .get( (req, res) => {
      Item.find({'restaurantId': req.params.restaurant_id}, (err, items) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json(items);
      });
    });

  router.route('/category/:category_id/items')
    .get( (req, res) => {
      Item.find({'_category': req.params.category_id}, (err, items) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json(items);
      });
    });

}
  // exports.getItemsJson = function(req, cb){
  // 	Item.find(function(err, items){
  // 		// if(err)
  // 		// 	cb(err);

  // 		cb(items);
  // 	});
  // }
