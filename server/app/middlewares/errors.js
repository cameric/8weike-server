// The middlewares serve all error handling

// This small helper function binds an error object
// with a string identifier that could be fed into
// parseErrors.
function bindErrorWithIdentifier(err, identifier, next) {
  Error.prototype.errorIdentifier = identifier;
  next(err);
}

// Log raw error messages to the console.
// Will only be applied in development environment.
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

// This function parse all types of error messages and
// re-organize them in a structured way such that
// they have the following signature:
// {
//    status: <status code [int]>,
//    message: <error message [string]>
// }
function parseErrors(err, req, res, next) {
  const errorsInfo = {
    mysql: {
      ER_DUP_ENTRY: {
        status: 409,
        messages: {
          signupWithPhone: 'Phone number already exists!'
        },
      },
    },
  };

  let error = {
    status: '',
    message: '',
  };

  // Parse MySQL errors
  if (err.code) {
    error.status = errorsInfo.mysql[err.code].status;
    error.message = errorsInfo.mysql[err.code].messages[err.errorIdentifier];
    next(error);
  } else if (err.statusCode) {
    // Potential customized errors
  } else {
    // Default to original error
    next(err);
  }
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
  bindErrorWithIdentifier,
  logErrors,
  parseErrors,
  clientErrorHandler,
  serverErrorHandler,
  notFoundError,
};
