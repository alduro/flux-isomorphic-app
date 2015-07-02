'use strict';

import User from '../models/user.js';
import log from 'debug';
import util from 'util';
import _ from 'lodash';
import passport from 'passport';
import crypto from 'crypto';
// import config from '../env/config';
import ensureAuth from '../middlewares/ensure-auth';

let logger = log('meego');

export default function (router) {

  //router.get('/signin', function (req, res, next) {
  //  if (req.isAuthenticated()) {
  //    res.redirect('/');
  //  } else {
  //    res.render('signin', { title: 'Sign in' });
  //  }
  //});

  router.post('/signin', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        logger('Passport error authenticate: ' + err);
        return next(err);
      }
      if (!user) {
        logger(info.message);
        return res.status(401).json({
          error: {
            name: 'BadCredentials',
            message: 'Wrong username or password'
          }
        });
      } else {
        logger('Logged in User');
        req.logIn(user, (err) => {
          if(err) {
            return next(err);
          }
          return res.status(200).json({
            success: true,
            message: 'User logged in.'
          });
        });
      }
    })(req, res, next);
  });

  router.get('/signout', ensureAuth, (req, res) => {
    logger('Logout USER: ' + util.inspect(req.user));
    if (req.isAuthenticated()) {
      req.logout();
      return res.status(200).json({
        success: true,
        message: 'User logged out.'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'User not logged in.'
      });
    }

  });

  //router.get('/signup', function (req, res, next) {
  //  res.render('signup', { title: 'Sign up' });
  //});

  router.post('/signup', (req, res, next) => {
    var params = req.body;
    params.password = User.encryptPassword(params.password);

    User.findOne({email: req.body.email}, (err, user) => {
      if (user) {
        return res.status(400).json({
          success: false,
          message: 'Email already taken.'
        });
      } else {
        User.create(params, (error, user) => {
          if (error) {
            logger(error);
            var msg = '';
            _.each(error, (message, key) => {
              msg += key + ': ' + message + '<br/>';
            });
            return res.status(400).json({
              success: false,
              message: msg
            });
          } else {
            req.logIn(user, (err) => {
              if (err) {
                return res.status(400).json({
                  success: false,
                  message: 'Error logging in user.' + err
                });
              } else {
                return res.status(200).json({
                  success: true,
                  message: 'Welcome to Meego.'
                });              }
            });
          }
        });
      }
    });
  });

  router.route('/users')
    .post( ensureAuth, (req, res, next) => {
      var user = new User();
      user.email = req.body.email;
      user.name = req.body.name;
      user.password = User.encryptPassword(req.body.password);
      user.save(function(err) {
          if (err) {
              // duplicate entry
              if (err.code == 11000)
                  return res.json({ success: false, message: 'A user with that username already exists. '});
              else
                  return res.send(err);
          }
          // return a message
          res.status(200).json({
            success: true,
            message: 'User created!'
          });
      });
    })
    .get( ensureAuth, (req, res, next) => {
      User.find( (err, users) => {
          if (err) {
            return res.status(400).json({
              success: false,
              message: 'Error logging in user.' + err
            });
          }
          res.status(200).json({
            success: true,
            users: users
          });
      });
    });

  router.route('/user/:user_id')
    .get( (req, res, next) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err) {
              return res.status(400).json({
                success: false,
                message: 'Error getting user.' + err
              });
            }
            // return that user
            res.status(200).json({
              success: true,
              user: user
            });
        });
    })
    .put( (req, res, next) => {
      User.findById(req.params.user_id, (err, user) => {

          if (err) res.send(err);

          // set the new user information if it exists in the request
          if (req.body.name) user.name = req.body.name;
          if (req.body.email) user.email = req.body.email;
          if (req.body.password) user.password = req.body.password;

          // save the user
          user.save(function(err) {
              if (err) res.send(err);

              // return a message
              res.json({ message: 'User updated!' });
          });

      });
    })
    .delete( (req, res, next) => {
      User.remove({
              _id: req.params.user_id
          }, (err, user) => {
              if (err) res.send(err);
              res.json({ message: 'Successfully deleted' });
          });
    });
}
