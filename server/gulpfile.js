"use strict";

/* This file sets a Gulp task runner to monitor backend
 * changes, which will trigger webpack to bundle all back-end
 * resource incrementally and compile webapp pages for server-side
 * React rendering.
 *
 * Note: This file needs to be written in ES5
 */

var gulp = require('gulp'),
    webpack = require('webpack'),
    nodemon = require('nodemon'),
    path = require('path'),
    WebpackDevServer = require('webpack-dev-server');

var config = require('./app/config/config'),
    clientWebappConfig = require('./webpack.config'),
    serverWebappConfig = require('./webpack.server.config');

gulp.task('webpack-dev-server', function () {
    // Enable debug mode in dev environment
    clientWebappConfig.debug = true;

    var startBundleTime;
    var compiler = webpack(clientWebappConfig);

    compiler.plugin('compile', function() {
        console.log('Bundling webapp resources...');
        startBundleTime = Date.now();
    });

    compiler.plugin('done', function() {
        console.log('Bundled webapp in ' + (Date.now() - startBundleTime) + 'ms');
    });

    var bundler = new WebpackDevServer(compiler, {
        publicPath: config.webapp.publicPath,
        noInfo: true,
        stats: {
            colors: true
        },
        proxy: {
            '*': 'http://localhost:' + config.express.port
        }
    });

    bundler.listen(config.dev.port, function (err) {
        if (err) {
            console.error("Error setting up webpack-dev-server: " + err);
        } else {
            console.log('webpack-dev-server Listening on http://localhost:' + config.dev.port);
            console.log("Web server will start running when bundling finishes...");
        }
    });
});

gulp.task('server-build', function () {
    console.log("Re-bundling server resource...");
    webpack(serverWebappConfig, function (err, stats) {
        if (err) {
            console.log("Error bundling server resource: " + err);
        } else {
            console.log("Bundling results: " + stats.toString());
        }
    });
});

gulp.task('run', ['webpack-dev-server', 'server-build'], function () {
    // First build new server.bundle.js
    gulp.watch([
        'app/**/*.js',
        'webapp/shared/**/*.js',
        'server.js'
    ], ['server-build']);

    // Restart node by listening to server.bundle.js changes
    nodemon({
        verbose: true,
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, '/server.bundle.js'),
        watch: ['server.bundle.js'],
        legacyWatch: true
    })
});

gulp.task('default', ['run']);
