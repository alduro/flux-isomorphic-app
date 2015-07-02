import passport   from 'passport';
import LocalStrategy from 'passport-local';
import debug from 'debug';
import util from 'util';
import User from '../models/user';
import BearerStrategy from 'passport-http-bearer';
import jwt from 'jsonwebtoken';

let logger = debug('passport');

passport.serializeUser( (user, done) => {
  debug('Serializing :' + util.inspect(user));
  done(null, user);
});

passport.deserializeUser( (user, done) => {
  logger('Deserializing :' + util.inspect(user));
  done(null, user);
});

passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
  }, (email, password, done) => {
    logger(email + ' ' + password);
    User.findOne({ 'email': email }, (err, user) => {
      logger('User :' + user);
      logger(err);
      if (err) { return done(err); }
      if (!user) {
         return done(null, false, { message: 'Incorrect email or password.' });
      }
      if (!user.authenticate(password)) {
         return done(null, false, { message: 'Incorrect email or password.' });
      }
      // if user is found and password is right
      // create a token
      var token = jwt.sign({
        name: user.name,
        email: user.email
      }, secret, {
        expiresInMinutes: 1440 // expires in 24 hours
      });
      user.token = token;
      return done(null, user);
    });
  }
));

passport.use(new BearerStrategy(
  (token, done) => {
    try {
      //we attempt to decode the token the user sends with his requests
      var decoded = jwt.decode(token, secret);
      //TODO: must check the token expiry and ensure the token is still valid
      //if token is expired return 401! (throw an exception, will be caught by catch clause)
      //we find the user that has made the request
      User.findOne({ email: decoded.email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false); //no such user
        }
        else {
          return done(null, user); //allows the call chain to continue to the intented route
        }
      });
    }
    catch(err){
      return done(null, false); //returns a 401 to the caller
    }
  }
));

