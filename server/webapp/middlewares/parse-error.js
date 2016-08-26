// A small middleware to parse async request error messages.

export default store => next => action => {
  if (!action.error)
    return next(action);

  if (action.payload.response.body) {
    // Normal error thrown by res.send()
    action.payload.parsedError = action.payload.response.body
  } else {
    // Fallback to default error message
    action.payload.parsedError = action.payload
  }

  next(action);
}
