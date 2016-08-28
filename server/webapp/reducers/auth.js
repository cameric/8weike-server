// This is reducers for all auth-related actions

// state = state.auth
function authReducers(state = {}, action) {
  switch (action.type) {
    case 'SIGNUP_WITH_PHONE_BASIC_INFO':
      if (action.error) {
        return Object.assign({}, state, {
          signup: {
            currentStep: 'basicInfo',
            status: 'error',
            error: action.payload.parsedError,
          }
        });
      } else {
        return Object.assign({}, state, {
          signup: {
            currentStep: 'basicInfo',
            status: 'success',
            nextStep: 'tfa',
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
