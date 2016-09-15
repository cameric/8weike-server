// This file is used for generating a localized Webpack config file for client.

const _ = require('lodash/array');
const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const I18nPlugin = require("i18n-webpack-plugin");

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
  new ExtractTextPlugin('style.bundle.css', {
    allChunks: true
  }),
];

module.exports = (langName, langLocale=null) => {
  let plugins = [];
  if (process.env.NODE_ENV === 'production') {
    plugins = _.concat(defaultPlugins, [
      new I18nPlugin(langLocale),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin(),
    ])
  } else {
    plugins = _.concat(defaultPlugins, [
      new I18nPlugin(langLocale),
    ]);
  }

  return {
    entry: (process.env.NODE_ENV === 'development') ? devEntryPoints : prodEntryPoints,
    devtool: 'sourcemap',
    output: {
      path: config.webapp.output,
      filename: process.env.NODE_ENV === 'production' ?
          `${langName}.webapp-[hash].bundle.js` :
          `${langName}.webapp.bundle.js`,
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
    plugins,
  }
};
