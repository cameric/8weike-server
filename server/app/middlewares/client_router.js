'use strict';

// This middleware defines client-side React routing.

const React = require('react'),
      ReactDOM = require('react-dom/server'),
      Router = require('react-router');

const routes = require('../../webapp/routes');

module.exports = (req, res, next) => {
    Router.match({ routes: routes, location: req.url }, (err, redirect, props) => {
        // in here we can make some decisions all at once
        if (err) {
            // there was an error somewhere during route matching
            console.log(`Get route error: ${err}`);
            res.status(500).send(err.message);
        } else if (redirect) {
            // we haven't talked about `onEnter` hooks on routes, but before a
            // route is entered, it can redirect. Here we handle on the server.
            res.redirect(redirect.pathname + redirect.search)
        } else if (props) {
            // if we got props then we matched a route and can render
            const context = React.createElement(Router.RouterContext, props);
            res.status(200).render('index', {
                reactContent: ReactDOM.renderToString(context)
            });
        } else {
            // no errors, no redirect, we just didn't match anything
            res.status(404).send('404 Not Found')
        }
    });

    next();
};
