// The store in the dev environment

import promiseMiddleware from 'redux-promise';
import { createStore, combineReducers, applyMiddleware } from 'redux';

import webAPIMiddleware from '../../middlewares/api';

// A list of middlewares to be fed into Redux
// Note that the order of middlewares matters.
let middlewares = [
  webAPIMiddleware,
  promiseMiddleware,
];

function configureStore(reducers) {
  return createStore(
      reducers,
      applyMiddleware(...middlewares)
  );
}

export default configureStore

