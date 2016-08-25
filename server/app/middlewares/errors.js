// The middlewares serve all error handling

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(err.status || 500).send({
      message: err.message,
      statusCode: (err.status || 500),
    });
  } else {
    next(err);
  }
}

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
  clientErrorHandler,
  serverErrorHandler,
  notFoundError,
};
