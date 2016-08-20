import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

// Reducer components
import authReducers from './reducers/auth'

function stubReducers(state = [], action) {
  switch (action.type) {
    case 'STUB':
      console.log(action.payload);
      return {};
    default:
      return state;
  }
}

const appReducers = combineReducers({
  stubReducers,
  routing: routerReducer
});

export default appReducers
