require('babel/register')({
  ignore: /node_modules\/(?!react-router)/
});
require('./server');