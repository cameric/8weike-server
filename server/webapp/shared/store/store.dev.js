// The store in the dev environment

import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import webAPIMiddleware from '../../middlewares/api';
import parseErrorMiddleware from '../../middlewares/parse-error';

// A list of middlewares to be fed into Redux
// Note that the order of middlewares matters.

let middlewares = [
  webAPIMiddleware,
  promiseMiddleware,
  parseErrorMiddleware,
];

// Only log Redux state changes on client side
if (global.BUNDLE_ID === "8WEIKE_WEB_CLIENT") {
  const loggerMiddleware = createLogger();
  middlewares.push(loggerMiddleware);
}

function configureStore(reducers, initialState) {
  return initialState ?
      createStore(
        reducers,
        JSON.parse(initialState),
        applyMiddleware(...middlewares)
      ) :
      createStore(
        reducers,
        applyMiddleware(...middlewares)
      );
}

export default configureStore
