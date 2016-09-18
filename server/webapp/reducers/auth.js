// This is reducers for all auth-related actions
import * as _ from 'lodash/object';

// state = state.auth
function authReducers(state = {}, action) {
  switch (action.type) {
    case 'SIGNUP_WITH_PHONE_CREDENTIAL':
      if (action.error) {
        return _.merge({}, state, {
          signup: {
            currentStep: 'credential',
            status: 'error',
            error: action.payload.parsedError,
          },
        });
      }

      return _.merge({}, state, {
        signup: {
          currentStep: 'credential',
          status: 'success',
          nextStep: 'tfa',
        },
      });
    case 'SIGNUP_WITH_PHONE_TFA':
      if (action.error) {
        return _.merge({}, state, {
          signup: {
            currentStep: 'tfa',
            status: 'error',
            error: action.payload.parsedError,
          },
        });
      }

      return _.merge({}, state, {
        uid: action.payload.id,
        hasProfile: false,
        signup: {
          currentStep: 'tfa',
          status: 'success',
          nextStep: 'profile',
        },
      });
    case 'RENDER_CAPTCHA_IN_SIGNUP':
      if (action.error) {
        return _.merge({}, state, {
          signup: { captcha: {} },
        });
      }

      return _.merge({}, state, {
        signup: {
          captcha: action.payload,
        },
      });
    case 'LOGIN_WITH_PHONE':
      if (action.error) {
        return Object.assign({}, state, {
          login: {
            status: 'error',
            error: action.payload.parsedError,
          },
        });
      }

      return Object.assign({}, state, {
        uid: action.payload.id,
        hasProfile: action.payload.profileId != null,
        login: {
          status: 'success',
        },
      });
    case 'LOAD_LOGIN_STATUS':
      if (action.error) {
        return Object.assign({}, state, {
          hasProfile: false,
          uid: null,
        });
      }

      return Object.assign({}, state, {
        hasProfile: true,
        uid: action.payload.id,
      });
    case 'LOGOUT':
      if (action.error) {
        return Object.assign({}, state, {
          login: {
            status: 'error',
            error: action.payload.parsedError,
          },
        });
      }

      // eslint-disable-next-line no-undef
      location.reload();
      return state;
    default:
      return state;
  }
}

export default authReducers;
