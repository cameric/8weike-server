import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';

// Reducer components
import authReducers from '../reducers/auth';
import profileReducers from '../reducers/profile';

function pageInitialState(state = {}, action) {
  switch (action.type) {
    case 'LOADED_INITIAL_STATE':
      return Object.assign({}, state, action.payload);
    default:
      return state
  }
}

const appReducers = combineReducers({
  pageInitialState,
  auth: authReducers,
  profile: profileReducers,
  routing: routerReducer,
});

export default appReducers
