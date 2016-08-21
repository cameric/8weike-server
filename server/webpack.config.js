// This file is used for configuring Webpack bundler for client.

const _ = require('lodash/array');
const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');

const defaultPlugins = [
  new webpack.DefinePlugin({
    'global.NODE_ENV': `"${process.env.NODE_ENV}"`,
    'global.BUNDLE_ID': '"8WEIKE_WEB_CLIENT"',
  })
];
const plugins = process.env.NODE_ENV === 'production' ?
    _.concat(defaultPlugins, [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ]) :
    defaultPlugins;

module.exports = {
  entry: [
    'babel-polyfill',
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
  plugins: plugins,
};
