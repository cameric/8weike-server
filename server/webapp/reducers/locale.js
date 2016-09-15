// This is reducers for all locale-related actions
import * as _ from 'lodash/object'

// state = state.locale
function localeReducers(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_LOCALE':
      location.reload();
      return state;
    default:
      return state;
  }
}

export default localeReducers;
