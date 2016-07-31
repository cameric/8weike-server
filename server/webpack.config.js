// This file is used for configuring Webpack bundler.

'use strict';

const path = require('path');
const config = require('./app/config/config');

module.exports = {
    entry: [
        path.join(config.root, '/webapp/index')
    ],
    devtool: 'eval-source-map',
    output: {
        path: path.join(config.root, '/webapp'),
        filename: 'webapp.bundle.js',
        publicPath: '/compiled/js/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.join(config.root, './webapp'),
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                include: path.join(config.root, './webapp'),
                loader: "style-loader!css-loader"
            }
        ]
    }
};