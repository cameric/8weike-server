// This file is used for configuring Webpack bundler for server.
// Note that we only compile code in shared

const nodeExternals = require('webpack-node-externals');
const _ = require('lodash/array');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');

const defaultPlugins = [
  new webpack.DefinePlugin({
    "global.GENTLY": JSON.stringify(false),
    'global.BUNDLE_ID': '"8WEIKE_SERVER"',
    // NOTE(tony): A slightly sneaky hack to enable server-side render
    // All occurrences will be replaced by subsequent client-side render
    '__': (str) => { return str },
  }),
];
const plugins = process.env.NODE_ENV === 'development' ?
    _.concat(defaultPlugins, [
      new webpack.BannerPlugin('require("source-map-support").install();',
          { raw: true, entryOnly: false }),
    ]) :
    defaultPlugins;

module.exports = {
  entry: path.resolve(__dirname, 'server.js'),
  devtool: 'sourcemap',
  output: {
    filename: 'server.bundle.js',
  },
  target: 'node',
  // keep node_module paths out of the bundle
  externals: [nodeExternals()],
  node: {
    __filename: true,
    __dirname: true,
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [config.webapp.source],
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: 'ignore-loader',
      },
      { test: /\.json$/,
        loader: "json-loader"
      }
    ],
  },
  plugins: plugins,
};
