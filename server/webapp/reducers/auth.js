// This is reducers for all auth-related actions
import * as _ from 'lodash/object'

// state = state.auth
function authReducers(state = {}, action) {
  switch (action.type) {
    case 'SIGNUP_WITH_PHONE_BASIC_INFO':
      if (action.error) {
        return _.merge({}, state, {
          signup: {
            currentStep: 'credential',
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        return _.merge({}, state, {
          id: action.payload.id,
          signup: {
            currentStep: 'credential',
            status: 'success',
            nextStep: 'tfa',
          }
        });
      }
    case 'SIGNUP_WITH_PHONE_TFA':
      if (action.error) {
        return _.merge({}, state, {
          signup: {
            currentStep: 'tfa',
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        return _.merge({}, state, {
          signup: {
            currentStep: 'tfa',
            status: 'success',
            nextStep: 'profile',
          }
        });
      }
    case 'RENDER_CAPTCHA_IN_SIGNUP':
      if (action.error) {
        return _.merge({}, state, {
          signup: { captcha: {} }
        });
      } else {
        return _.merge({}, state, {
          signup: {
            captcha: action.payload
          }
        });
      }
    case 'LOGIN_WITH_PHONE':
      if (action.error) {
        return Object.assign({}, state, {
          login: {
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        return Object.assign({}, state, {
          uid: action.payload.id,
          hasProfile: action.payload.profileId != null,
          login: {
            status: 'success',
          }
        });
      }
    case 'LOAD_LOGIN_STATUS':
      if (action.error) {
        return Object.assign({}, state, {
          uid: null,
        });
      } else {
        return Object.assign({}, state, {
          uid: action.payload.id,
        });
      }
    case 'LOGOUT':
      if (action.error) {
        return Object.assign({}, state, {
          login: {
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        location.reload();
        return state;
      }
    default:
      return state;
  }
}

export default authReducers
