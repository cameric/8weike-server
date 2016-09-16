// The store in the production environment

import promiseMiddleware from 'redux-promise';
import { createStore, applyMiddleware } from 'redux';

import webAPIMiddleware from '../../middlewares/api';
import parseErrorMiddleware from '../../middlewares/parse-error';

// A list of middlewares to be fed into Redux
// Note that the order of middlewares matters.
const middlewares = [
  webAPIMiddleware,
  promiseMiddleware,
  parseErrorMiddleware,
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

export default configureStore;
