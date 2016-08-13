// This middleware defines client-side React routing.

const react = require('react');
const reactDOM = require('react-dom/server');
const router = require('react-router');

// eslint-disable-next-line import/no-extraneous-dependencies
const routes = require('webapp/shared/routes');

function match(req, res, next) {
  router.match({ routes: routes.default, location: req.url }, (err, redirect, props) => {
    // In here we can make some decisions all at once
    if (err) {
      // There was an error somewhere during route matching
      next(`Route matching error: ${err.message}`);
    } else if (redirect) {
      // Before a route is entered, it can redirect so handle it first.
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      // If we got props then we matched a route and can render
      const context = react.createElement(router.RouterContext, props);
      res.status(200).render('index', {
        reactContent: reactDOM.renderToString(context),
      });
    } else {
      // We didn't match anything. Go on to match API router.
      next();
    }
  });
}

module.exports = match;
