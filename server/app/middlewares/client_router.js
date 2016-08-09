'use strict';

// This middleware defines client-side React routing.

const React = require('react'),
      ReactDOM = require('react-dom/server'),
      Router = require('react-router');

const routes = require('../../webapp/shared/routes');

module.exports = (req, res, next) => {
    Router.match({ routes: routes.default, location: req.url }, (err, redirect, props) => {
        // in here we can make some decisions all at once
        if (err) {
            // there was an error somewhere during route matching
            next(`Route matching error: ${err.message}`);
        } else if (redirect) {
            // before a route is entered, it can redirect so handle it first.
            res.redirect(redirect.pathname + redirect.search)
        } else if (props) {
            // if we got props then we matched a route and can render
            const context = React.createElement(Router.RouterContext, props);
            res.status(200).render('index', {
                reactContent: ReactDOM.renderToString(context)
            });
        } else {
            // We don't match anything. Go on to match API router.
            next();
        }
    });
};
