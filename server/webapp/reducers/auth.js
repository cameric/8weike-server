// This is reducers for all auth-related actions
import * as _ from 'lodash/object'

// state = state.auth
function authReducers(state = {}, action) {
  switch (action.type) {
    case 'SIGNUP_WITH_PHONE_BASIC_INFO':
      if (action.error) {
        return _.merge({}, state, {
          signup: {
            currentStep: 'basicInfo',
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        return _.merge({}, state, {
          signup: {
            currentStep: 'basicInfo',
            status: 'success',
            nextStep: 'tfa',
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
          login: {
            status: 'success',
          }
        });
      }
    default:
      return state;
  }
}

export default authReducers
