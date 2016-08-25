// WebAPIMiddleware for sending all API requests

/* NOTE(tony): use superagent instead of isomorphic-fetch
 * to walk around the socket hanging issue.
 * TODO: Figure out what happened with server-side fetch (i.e. node-fetch)
 */
import superagent from 'superagent';

import { noopAction } from '../actions/utils';

export default store => next => action => {
  if (action.type !== 'WEB_REQUEST') {
    return next(action);
  }

  let request = action.payload;
  let { method, url, body, nextAction } = request;

  if (!nextAction)
    nextAction = noopAction;

  // Construct a FSA action with a promise payload
  // and pass it down to redux-promise
  return next(nextAction(new Promise((fulfill, reject) => {
    superagent(method, url)
      .set({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      })
      .send(JSON.stringify(body || {}))
      .then((response) => {
        // Client-side rendering goes through `response.text`
        // Server-side rendering goes through `response.res.text`
        fulfill(JSON.parse(response.text || response.res.text));
      }, (error) => {
        reject(error);
      });
  })))
}
