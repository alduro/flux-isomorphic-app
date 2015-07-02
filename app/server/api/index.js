'use strict';

import express from 'express';
// import auth from './auth';
import items from './items';
import orders from './orders';
import restaurants from './restaurants';
import users from './users';

const apiRouter = express.Router();

// auth(apiRouter);
items(apiRouter);
orders(apiRouter);
restaurants(apiRouter);
users(apiRouter);

export default apiRouter;
