// WebAPIMiddleware for handling all API requests on the client side

export default store => next => action => {
  if (action.type !== 'WEB_REQUEST') {
    return next(action);
  }

  let request = action.payload;
  let { method, url, body, nextAction } = request;

  // Pass a FSA promise action to redux-promise
  return next(nextAction(new Promise((fulfill, reject) => {
    fetch(url, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    }).then((response) => {
      return response.text();
    }).then((responseText) => {
      return JSON.parse(responseText);
    }).then((json) => {
      fulfill(json);
    }).catch((err) => {
      console.log(err);
      reject(err);
    })
  })))
}
