'use strict';
let webpack = require('webpack');
const BASE = `${__dirname}/public/scripts`;

module.exports = {
  entry: `${BASE}/main.es6`,
  output: {
    path: `${__dirname}/public/`,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css/, loader: 'style-loader!css-loader!autoprefixer-loader' },
      { test: /\.es6/, loader: 'babel-loader' },
      { test: /\.html/, loader: 'ractive' }
    ]
  }
};
