// A small middleware to parse async request error messages.

export default store => next => action => {
  if (!action.error) {
    return next(action);
  }

  if (action.payload.response.body) {
    // Normal error thrown by res.send()
    // eslint-disable-next-line no-param-reassign
    action.payload.parsedError = action.payload.response.body;
  } else {
    // Fallback to default error message
    // eslint-disable-next-line no-param-reassign
    action.payload.parsedError = action.payload;
  }

  next(action);
};
