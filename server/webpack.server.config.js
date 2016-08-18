// This file is used for configuring Webpack bundler for server.
// Note that we only compile code in shared

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('./app/config/config');

module.exports = {
  entry: path.resolve(__dirname, 'server.js'),
  devtool: 'sourcemap',
  output: {
    filename: 'server.bundle.js',
  },
  target: 'node',
  // keep node_module paths out of the bundle
  externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
    'react-dom/server', 'react/addons',
  ]).reduce((ext, mod) => {
    ext[mod] = `commonjs ${mod}`;
    return ext;
  }, {}),
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
    ],
  },
  plugins: process.env.NODE_ENV === 'development' ? [
    new webpack.BannerPlugin('require("source-map-support").install();',
        { raw: true, entryOnly: false })
  ] : [],
};
