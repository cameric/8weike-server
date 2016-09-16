// This middleware defines client-side React routing.

const _ = require('lodash/core');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const router = require('react-router');
const Redux = require('react-redux');
const serialize = require('serialize-javascript');

const config = require('../config/config');
const routes = require('../../webapp/shared/routes').default;
const configureStore = require('../../webapp/shared/store/store').default;
const reducers = require('../../webapp/shared/reducers').default;

const ce = React.createElement;

function loadReduxInitialState(props, store) {
  const { query, params } = props;
  const component = props.components[props.components.length - 1].WrappedComponent;
  return _.has(component, 'fetchData') ?
    component.fetchData({ query, params, store }) :
    Promise.resolve();
}

function match(req, res, next) {
  router.match({ routes, location: req.url }, (err, redirect, props) => {
    // In here we can make some decisions all at once
    if (err) {
      // There was an error somewhere during route matching
      next(new Error(`Route matching error: ${err.message}`));
    } else if (redirect) {
      // Before a route is entered, it can redirect so handle it first.
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      // Server-side rendering of initial state
      const store = configureStore(reducers);
      loadReduxInitialState(props, store).then(() => {
        const locale = req.cookies[config.locale.cookie] || config.locale.default;
        const context = ce(Redux.Provider, {
          store,
        }, ce(router.RouterContext, props));

        // If we got props then we matched a route and can render
        // Note(tony): try ... catch block is ugly but we have to use it
        // to catch the error in `renderToString`. Otherwise the request will hang.
        let result = null;
        try {
          result = ReactDOMServer.renderToString(context);
        } catch (renderErr) {
          // Fallback to client-side rendering
          if (process.env.NODE_ENV === 'development') {
            console.log('Server-side rendering failed with error:');
            console.log(renderErr);
          }
          result = '';
        }

        res.status(200).render('index', {
          reactContent: result,
          reduxInitialState: serialize(Object.assign({}, store.getState(), {
            locale,
          })),
          nonceHash: config.csp.nonceHash,
          locale,
        });
      });
    } else {
      // We didn't match anything. Go on to match API router.
      next();
    }
  });
}

module.exports = match;
