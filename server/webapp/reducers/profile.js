// This is reducers for all profile-related actions
import * as _ from 'lodash/object';

// state = state.profile
function profileReducers(state = {}, action) {
  switch (action.type) {
    case 'CREATE_PROFILE':
      if (action.error) {
        return _.merge({}, state, {
          error: action.payload.error,
        });
      }

      return _.merge({}, state, {
        info: {
          id: action.payload.profileId,
        },
      });

    case 'LOAD_PROFILE_BY_ID':
      // Use loaded attribute to separate initial loading
      // and server-side rendering to avoid flashing
      if (action.error) {
        return _.merge({}, state, {
          error: action.payload.error,
        });
      }

      return _.merge({}, state, {
        info: action.payload,
      });
    default:
      return state;
  }
}

export default profileReducers;
