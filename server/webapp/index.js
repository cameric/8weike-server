// This is the entry point for 8Weike React webapp

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import configureStore from './shared/store/store';
import routes from './shared/routes';
import reducers from './shared/reducers';

// Configure universal store with server
// eslint-disable-next-line no-undef no-underscore-dangle
const store = configureStore(reducers, window.__REDUX_INITIAL_STATE__);
const history = syncHistoryWithStore(browserHistory, store);

// Enable onTapEvent support
injectTapEventPlugin();

// After initial server-side rendering, ReactDOM.render()
// will be called to update the state and event handlers.
// eslint-disable-next-line no-undef
const appContainer = document.getElementById('8weike-app-container');
ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  appContainer
);
