'use strict';

import Order from '../models/order';
import ipn from 'paypal-ipn';
import config from '../env/config';

//import path from 'path';
//import nodemailer from 'nodemailer';
//import emailTemplates from 'email-templates';
//let emailTemplatesDir = path.resolve(__dirname, '..', 'templates');
//import smtpTransport from 'nodemailer-smtp-transport';

//import csv from 'express-csv';

let page_limit = config.page_limit;

export default function (router) {

  router.route('/openOrders')
    .get((req, res) => {
      Order.find({status: {'$ne': 4}}).sort({createdAt: 'desc'}).exec((err, orders) => {
        if (err) {
          res.send(err);
        }
        res.status(200).json(orders);
      });
    });

  router.route('/orders')
    // .post(orderController.postOrders(io))
    .post((socket) => {
      return (req, res, next) => {
        let order = new Order();

        order.userId = req.body.userId;
        order.name = req.body.name;
        order.amount = req.body.amount;
        order.phone = req.body.phone;
        order.email = req.body.email;

        order.status = 1;

        order.type = req.body.orderType;

        // order.createdAt = moment().utcOffset('8');

        order.restaurant.name = req.body.restaurantName;
        order.restaurant.image = req.body.restaurantImage;

        order.items = req.body.items;

        order.orderNumber = (Math.random() + 1).toString(36).substring(2, 7); //temp solution to generate random string

        order.save((err) => {
          if (err) {
            res.send(err);
          }

          socket.emit('new_order', order);

          // TODO put this into a Job Queue
          //var mailOptions = {
          //    from: 'Meego <orders@meego.co>', // sender address
          //    to: req.body.email, // list of receivers
          //    subject: 'Meego - Your Order Confirmation Number', // Subject line
          //    // text: 'Hello world ✔', // plaintext body
          //    html: '<b>Your order confirmation number is : '+order.orderNumber+'</b>' // html body
          //};
          //
          //// send mail with defined transport object
          //transporter.sendMail(mailOptions, (error, info) => {
          //    if(error){
          //        console.log(error);
          //    }else{
          //        console.log('Message sent: ' + info.response);
          //    }
          //});

          res.status(200).json({message: "Order Saved", data: order});
        });
      }
    })
    .get((req, res) => {
      Order.find().sort({createdAt: 'desc'}).exec((err, orders) => {
        if (err) {
          return res.send(err);
        }
        return res.status(200).json(orders);
      });
    });

  router.route('/orders/notify')
    .post((socket) => {
      return (req, res, next) => {
        ipn.verify(req.body, {'allow_sandbox': config.paypal_sandbox}, (err, msg) => {
          if (err) {
            return res.send(err);
          } else {
            if (req.body.payment_status == 'Completed') {
              let details = req.body.custom.split('|'); //0: uid, 1: Name, 2: phone, 3: email, 4: remarks, 5: order type, 6: pickup time

              let order = new Order();

              order.userId = details[0];
              order.name = details[1];
              order.amount = req.body.mc_gross;
              order.phone = details[2];
              order.email = details[3];
              order.remarks = details[4];
              order.type = details[5];
              order.pickup_time = details[6];

              order.status = 1;

              order.paypal_fee = req.body.mc_fee;

              // order.restaurant.name = req.body.restaurantName;
              // order.restaurant.image = req.body.restaurantImage;

              // order.items = req.body.items;

              let counter = 1;
              let currentItem = 'item_name' + counter;

              while (req.body[currentItem]) {

                order.items.push(
                  {
                    'item_id': req.body['item_number' + counter],
                    'price': req.body['mc_gross_' + counter],
                    // 'quantity': req.body.itemQuantities[i],
                    'quantity': 1,
                    'name': req.body['item_name' + counter]
                  });

                counter++;
                currentItem = 'item_name' + counter;
              }

              order.orderNumber = (Math.random() + 1).toString(36).substring(2, 7); //temp solution to generate random string

              // console.log('Saving Order...');
              // console.log(order);

              order.save((err)  => {
                if (err)
                  res.send(err);
                socket.emit('new_order', order);

                var mailOptions = {
                  from: 'Meego Orders<orders@meego.co>', // sender address
                  to: details[2], // list of receivers
                  subject: 'Meego - Your Order Confirmation Number', // Subject line
                  // text: 'Hello world ✔', // plaintext body
                  html: 'Thank you for your purchase. <br/><b>Your order confirmation number is : ' + order.orderNumber + '</b>' // html body
                };


                var merchantNotificationMailOptions = {
                  from: 'Meego Orders<orders@meego.co>', // sender address
                  to: 'beetschiu89@yahoo.com.hk', // list of receivers
                  subject: 'Meego - A new order has arrived!', // Subject line
                  // text: 'Hello world ✔', // plaintext body
                  html: 'A new order has arrived!' // html body
                };

                // send mail with defined transport object
                // transporter.sendMail(mailOptions, function(error, info){
                //     if(error){
                //         console.log(error);
                //     }else{
                //         console.log('Message sent: ' + info.response);
                //     }
                // });

                // transporter.sendMail(merchantNotificationMailOptions, function(error, info){
                //     if(error){
                //         console.log(error);
                //     }else{
                //         console.log('Message sent: ' + info.response);
                //     }
                // });
                emailTemplates(emailTemplatesDir, (err, template) => {
                  if (err) {
                    console.log(err);
                  } else {
                    var locals = {
                      email: details[3],
                      confirmation_number: order.orderNumber,
                      items: order.items
                    };

                    console.log('Sending mail to: ' + details[2]);

                    template('purchase-confirm', locals, (err, html, text) => {
                      if (err) {
                        console.log(err);
                      } else {
                        transporter.sendMail({
                          from: 'Meego Orders<orders@meego.co>',
                          to: locals.email,
                          subject: 'Meego - Your Order Confirmation',
                          html: html,
                          text: text
                        }, (err, responseStatus) => {
                          if (err) {
                            console.log(err);
                          } else {
                            console.log(responseStatus);
                          }
                        });
                      }
                    });
                  }

                });

                res.status(200).json({message: "Order Saved", data: order});
              });

            }

          }
        })
      }
    });

  router.route('/orders/:order_id')
    .put((req, res, next) => {
      Order.findById(req.params.order_id, (err, order) => {
        if (order) {
          if (err)
            return res.send(err);

          // order.restaurant.name = req.body.name;
          // order.restaurant.image = req.body.image;
          if (req.body.status) {
            order.status = req.body.status;
          }

          order.save((err) => {
            if (err) {
              return res.send(err);
            }
            return res.json(order);
          });
        } else {
          return res.send("No Order Found!");
        }
      });
    })
    .delete((req, res, next) => {
      Order.findByIdAndRemove(req.params.order_id, (err, order) => {
        if (err)
          res.send(err);
        res.json({message: "Order Removed"});
      });
    });

  //router.route('/report')
  //  .get( (req, res, next) => {
  //    Order.find().sort({createdAt: 'desc'}).exec( (err, orders) => {
  //      if (err)
  //        return res.send(err);
  //      return res.csv(JSON.parse(orders));
  //    });
  //  });

}
