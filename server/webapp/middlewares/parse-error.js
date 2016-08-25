// A small middleware to parse async request error messages.

export default store => next => action => {
  if (!action.error)
    return next(action);

  if (action.payload.response.body) {
    // Normal error thrown by res.send()
    action.payload.errorMsg = action.payload.response.body.error
  } else {
    // Fallback to default error message
    action.payload.errorMsg = action.payload.message
  }

  next(action);
}
