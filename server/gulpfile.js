"use strict";

/* This file sets a Gulp task runner to monitor backend
 * changes, which will trigger webpack to bundle all back-end
 * resource incrementally and compile webapp pages for server-side
 * React rendering.
 *
 * Note: This file needs to be written in ES5
 */

var eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    webpack = require('webpack'),
    nodemon = require('nodemon'),
    path = require('path'),
    WebpackDevServer = require('webpack-dev-server');

var config = require('./app/config/config'),
    clientWebappConfig = require('./webpack.config'),
    serverWebappConfig = require('./webpack.server.config');

let SOURCE_GLOBS = [
    'app/**/*.js',
    'webapp/shared/**/*.js',
    'server.js'
]

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
        contentBase: config.webapp.source,
        publicPath: config.webapp.publicPath,
        filename: clientWebappConfig.output.filename,
        historyApiFallback: true,
        stats: {
            colors: true
        },
        proxy: {
            // Only proxy API calls. Page routing fallback to historyApiFallback
            'api*': 'http://localhost:' + config.express.port + '/api'
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
    gulp.watch(SOURCE_GLOBS, ['server-build']);

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

gulp.task('lint', function () {
    return gulp.src(SOURCE_GLOBS)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('default', ['run']);
