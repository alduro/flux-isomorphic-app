const config = {
  environment: process.env.NODE_ENV,

  http: {
    virtualHost: process.env.VIRTUAL_HOST || 'localhost',
    host: process.env.HOST || 'localhost',
    port: process.env.VIRTUAL_PORT || 3000,
  },

  webpack: {
    dev: {
      port: process.env.WEBPACK_DEV_PORT || 8081,
    },
  },

  db: {
    url: process.env.URL_MONGO || 'mongodb://localhost:27017/gogoups'
  }
};

config.page_limit = 10;
config.salt = 'meego';

config.common = {
  poi: {
    url: process.env.POI_SERVICE_URL,
  },
};


export default config;
