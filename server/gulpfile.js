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
    path = require('path');

var serverConfig = require('./webpack.server.config');

gulp.task('server-build', function () {
    webpack(serverConfig).watch(100, function(err, stats) {
        if (err) {
            console.log("Error bundling server resource: " + err);
        } else {
            console.log("Bundling results: " + stats.toString());
            nodemon.restart();
        }
    })
});

gulp.task('run', ['server-build'], function () {
    nodemon({
        execMap: {
            js: 'node'
        },
        script: path.join(__dirname, '/server.bundle.js'),
        ignore: ['*'], // We don't watch any file path
        ext: 'none'    // We don't watch any file type
    }).on('restart', function() {
        console.log('\nRestarting node server due to changes\n');
    });
});

gulp.task('default', ['run']);
