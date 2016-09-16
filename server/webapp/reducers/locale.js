// This is reducers for all locale-related actions

// state = state.locale
function localeReducers(state = {}, action) {
  switch (action.type) {
    case 'UPDATE_LOCALE':
      // eslint-disable-next-line no-undef
      location.reload();
      return state;
    default:
      return state;
  }
}

export default localeReducers;
