import express from 'express';
import path from 'path';
import passport from 'passport';
import mongoose from 'mongoose';
import favicon from 'serve-favicon';
import ExpressLocation from 'react-router-express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import React from 'react';
import ReactRouter from 'react-router';
import FluxComponent from 'flummox/component';
import config from './env/config';
import webpack from './env/webpack-config';
import Flux from '../shared/flux';
import routes from '../shared/routes';

import api from './api';

let app = express();

app.set('view engine', 'html');
app.set('views', path.join(process.cwd(), 'app/server/views'));
app.engine('html', require('ejs').renderFile);

// server.use('/assets', express.static(path.join(__dirname, '../../assets')));
const publicFolder = path.join(__dirname, '../../', 'public');
app.use(favicon(path.join(publicFolder, 'favicon.ico')));
app.use(express.static(publicFolder));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategies
import './middlewares/passport';

// register apis
app.use('/api', api);

//Mongoose connection
mongoose.connect(config.db.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongoose connected');
});

// Isomorphic Flux
app.use(function (req, res, next) {
  const location = new ExpressLocation(req.url, res);

  const flux = new Flux({ serverSide: true, config: config.common });

  const router = ReactRouter.create({
    routes,
    location,
    transitionContext: { flux },
  });

  router.run((Handler, state) => {
    if (state.routes.length === 0) { return next(); }

    if (location.redirect()) { return; }

    const name = state.routes[state.routes.length - 1].name;

    const html = React.renderToString(
      <FluxComponent flux={flux} render={state => {
          return <Handler {...state} params={state.params} />;
        }}
      />
    );

    const data = {
      bundlePath: webpack.output.publicPath,
      state: `window.FLUX_STATE = ${JSON.stringify(flux.serialize())};`,
      html,
    };

    if (name === 'not-found') { res.status(404); }

    res.render('index', data);
  });
});


app = app.listen(config.http.port, config.http.host, function (err) {
  if (err) { return console.error(err); }

  const address = app.address();
  console.log(`server listening on http://${address.address}:${address.port}/`);
});


if (config.environment !== 'production') {
  const server = require('./env/webpack-dev-server');

  server.listen(config.webpack.dev.port, function (err) {
    if (err) { return console.error(err); }

    const address = server.listeningApp.address();
    console.log(`webpack dev server listening on http://${address.address}:${address.port}/`);
  });
}
