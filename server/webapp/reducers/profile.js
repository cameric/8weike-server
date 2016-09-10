// This is reducers for all auth-related actions
import * as _ from 'lodash/object'

// state = state.profile
function profileReducers(state = {}, action) {
  switch (action.type) {
    case 'CREATE_PROFILE':
      if (action.error) {
        return _.merge({}, state, {
          error: action.payload.error,
        });
      } else {
        return _.merge({}, state, {
          id: action.payload.profileId,
        });
      }
    default:
      return state;
  }
}

export default profileReducers;