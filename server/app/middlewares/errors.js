'use strict';

// The middlewares serve all error handling

const logErrors = (err, req, res, next) => {
    console.error(err.stack);
    next(err);
};

const serverErrors = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        statusCode: (err.status || 500),
        error: () => {
            if (process.env.NODE_ENV === 'development') return err;
            else                                        return {};
        }
    });
};

const notFoundError = (req, res) => {
    res.status(404).render('error', {
        message: "Cannot match any route!",
        statusCode: 404
    });
};

module.exports = {
    logErrors,
    serverErrors,
    notFoundError
};