// This middleware defines client-side React routing.

const _ = require('lodash/core');
const React = require('react');
const ReactDOM = require('react-dom/server');
const router = require('react-router');
const Redux = require('react-redux');
const serialize = require('serialize-javascript');

const routes = require('../../webapp/shared/routes').default;
const configureStore = require('../../webapp/shared/store/store').default;
const reducers = require('../../webapp/shared/reducers').default;

const ce = React.createElement;

function loadReduxInitialState(props, store) {
  let { query, params } = props;
  let component = props.components[props.components.length - 1].WrappedComponent;
  return _.has(component, 'fetchData') ?
    component.fetchData({ query, params, store }) :
    Promise.resolve();
}

function match(req, res, next) {
  router.match({ routes: routes, location: req.url }, (err, redirect, props) => {
    // In here we can make some decisions all at once
    if (err) {
      // There was an error somewhere during route matching
      next(`Route matching error: ${err.message}`);
    } else if (redirect) {
      // Before a route is entered, it can redirect so handle it first.
      res.redirect(redirect.pathname + redirect.search);
    } else if (props) {
      // Server-side rendering of initial state
      const store = configureStore(reducers);
      loadReduxInitialState(props, store).then(() => {
        const reduxInitialState = serialize(store.getState());
        const context = ce(Redux.Provider, {
          store: store
        }, ce(router.RouterContext, props));

        // If we got props then we matched a route and can render
        res.status(200).render('index', {
          reactContent: ReactDOM.renderToString(context),
          reduxInitialState,
        });
      });
    } else {
      // We didn't match anything. Go on to match API router.
      next();
    }
  });
}

module.exports = match;
