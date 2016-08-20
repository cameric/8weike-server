// This file is used for configuring Webpack bundler for client.

const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    `webpack-dev-server/client?http://localhost:${config.dev.port}`,
    path.join(config.webapp.source, '/index'),
  ],
  devtool: 'sourcemap',
  output: {
    path: config.webapp.output,
    filename: process.env.NODE_ENV === 'production' ?
        'webapp-[hash].bundle.js' :
        'webapp.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: config.webapp.source,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        include: config.webapp.source,
        loader: 'style-loader!css-loader',
      },
    ],
  },
  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ] : [],
};
