// The store in the dev environment

import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import webAPIMiddleware from '../../middlewares/api';

// A list of middlewares to be fed into Redux
// Note that the order of middlewares matters.
const loggerMiddleware = createLogger();
let middlewares = [
  webAPIMiddleware,
  promiseMiddleware,
  loggerMiddleware
];

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
