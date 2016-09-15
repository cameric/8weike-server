// The middlewares serve all error handling
const Promise = require('bluebird');
const i18n = require('i18n');

// Log raw error messages to the console.
// Will only be applied in development environment.
function logErrors(err, req, res, next) {
  // TODO: this outputs errors during "error expected" cases during manual testing and makes the
  // output nearly unreadable if we print the full stack. I'm printing only critical errors for now.
  if (!(err instanceof Promise.OperationalError)) {
    console.error(err);
  }
  next(err);
}

// Localize error messages
function localizeErrors(err, req, res, next) {
  err.message = i18n.__(err.message || "");
  next(err);
}

// Handle errors produced by Ajax requests
function clientErrorHandler(err, req, res, next) {
  // Use this check to separate client- and server-side errors.
  if (req.xhr) {
    res.status(err.status || 500).send({
      message: err.message,
      statusCode: (err.status || 500),
    });
  } else {
    next(err);
  }
}

// Handle errors produced by server-side failure.
// Will render an error page to the client-side.
function serverErrorHandler(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    statusCode: (err.status || 500),
    error: () => {
      if (process.env.NODE_ENV === 'development') return err;
      return {};
    },
  });
}

function notFoundError(req, res) {
  res.status(404).render('error', {
    message: 'Cannot match any route!',
    statusCode: 404,
  });
}

module.exports = {
  logErrors,
  localizeErrors,
  clientErrorHandler,
  serverErrorHandler,
  notFoundError,
};
