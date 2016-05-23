'use strict';

let config = require('config');
let express = require('express');
let logger = require('morgan');
let request = require('request-promise');
let data = require('./data.json');

let app = new express();

// ## Middleware

app.use(logger('dev'));
app.use(express.static(`${__dirname}/public`));

// ## Routes
if (config.env == 'dev') {
  let webpackMiddleware = require('webpack-dev-middleware');
  let webpack = require('webpack');
  let webpackConfig = require('./webpack.config.js');
  app.use(webpackMiddleware(webpack(webpackConfig), {}));
}

app.get('/api/data', (req, resp) => {
  let start = parseInt(req.query.start || 0);
  let size = parseInt(req.query.size || 1000);
  let results = {
    results: data.slice(start, start+size),
    total: data.length
  }

  setTimeout(() => resp.json(results), 3500); // Fake delay to simulate reality
});

app.listen(config.port, () => console.log(`Server running on port ${config.port}...`));
