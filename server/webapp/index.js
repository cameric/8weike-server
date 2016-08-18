'use strict';

// This is the entry point for 8Weike React webapp

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux'
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';

import routes from './shared/routes'
import reducers from './reducers'

const store = createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer
    })
);
const history = syncHistoryWithStore(browserHistory, store);

// After initial server-side rendering, ReactDOM.render()
// will be called to update the state and event handlers.
const appContainer = document.getElementById('8weike-app-container');
ReactDOM.render(
    <Provider store={store}>
      <Router routes={routes} history={history}/>
    </Provider>,
    appContainer
);
