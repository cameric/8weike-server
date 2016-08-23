// This file is used for configuring Webpack bundler for client.

const _ = require('lodash/array');
const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const devEntryPoints = [
  'babel-polyfill',
  `webpack-dev-server/client?http://localhost:${config.dev.port}`,
  path.join(config.webapp.source, '/index'),
];
const prodEntryPoints = [
  'babel-polyfill',
  path.join(config.webapp.source, '/index'),
];

const defaultPlugins = [
  new webpack.DefinePlugin({
    'global.NODE_ENV': `"${process.env.NODE_ENV}"`,
    'global.BUNDLE_ID': '"8WEIKE_WEB_CLIENT"',
  }),
  new ExtractTextPlugin(`${config.webapp.output}/style.css`, {
    allChunks: true
  })
];
const plugins = (process.env.NODE_ENV === 'production') ?
    _.concat(defaultPlugins, [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ]) :
    defaultPlugins;

module.exports = {
  entry: (process.env.NODE_ENV === 'development') ? devEntryPoints : prodEntryPoints,
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
        test: /\.scss$/,
        include: config.webapp.source,
        loader: ExtractTextPlugin.extract(
            'style',
            'css?sourceMap!sass?sourceMap'
        ),
      },
    ],
  },
  plugins: plugins,
};
