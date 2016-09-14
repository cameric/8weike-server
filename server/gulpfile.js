/* This file sets a Gulp task runner to monitor backend
 * changes, which will trigger webpack to bundle all back-end
 * resource incrementally and compile webapp pages for server-side
 * React rendering.
 */

const eslint = require('gulp-eslint');
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const nodemon = require('nodemon');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const config = require('./app/config/config');
const clientWebappConfig = require('./webpack.client.config.template')('en');
const serverWebappConfig = require('./webpack.server.config');

const SOURCE_GLOBS = [
  'app/**/*.js',
  'webapp/shared/**/*.js',
  'server.js',
];

gulp.task('webpack-dev-server', () => {
  // Enable debug mode in dev environment
  clientWebappConfig.debug = true;

  let startBundleTime;
  const compiler = webpack(clientWebappConfig);

  compiler.plugin('compile', () => {
    console.log('Bundling webapp resources...');
    startBundleTime = Date.now();
  });

  compiler.plugin('done', () => {
    console.log(`Bundled webapp in ${(Date.now() - startBundleTime)} ms`);
  });

  const bundler = new WebpackDevServer(compiler, {
    contentBase: config.webapp.source,
    publicPath: config.webapp.publicPath,
    filename: clientWebappConfig.output.filename,
    historyApiFallback: true,
    stats: {
      colors: true,
    },
    proxy: {
      // Only proxy API calls. Page routing fallback to historyApiFallback
      '/api/*': {
        target: `http://localhost:${config.express.http.port}`,
        secure: false,
      },
    },
  });

  bundler.listen(config.dev.port, (err) => {
    if (err) {
      console.error(`Error setting up webpack-dev-server: ${err}`);
    } else {
      console.log(`webpack-dev-server Listening on http://localhost:${config.dev.port}`);
      console.log('Web server will start running when bundling finishes...');
    }
  });
});

gulp.task('server-build', () => {
  console.log('Re-bundling server resource...');
  webpack(serverWebappConfig, (err, stats) => {
    if (err) {
      console.log(`Error bundling server resource: ${err}`);
    } else {
      console.log(`Bundling results: ${stats.toString()}`);
    }
  });
});

gulp.task('run', ['webpack-dev-server', 'server-build'], () => {
  // First build new server.bundle.js
  gulp.watch(SOURCE_GLOBS, ['server-build']);

  // Restart node by listening to server.bundle.js changes
  nodemon({
    verbose: true,
    execMap: {
      js: 'node',
    },
    script: path.join(__dirname, '/server.bundle.js'),
    watch: ['server.bundle.js'],
    legacyWatch: true,
  });
});

gulp.task('lint', () => {
  return gulp.src(SOURCE_GLOBS)
      .pipe(eslint())
      .pipe(eslint.format());
});

gulp.task('doc', () => {
  const jsdocConfig = require('./.jsdoc.conf.json');
  return gulp.src(SOURCE_GLOBS, { read: false })
      .pipe(jsdoc(jsdocConfig));
});

gulp.task('default', ['run']);
