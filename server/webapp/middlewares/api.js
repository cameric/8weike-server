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

  const request = action.payload;
  const { method, url, body } = request;
  let { nextAction } = request;

  if (!nextAction) {
    nextAction = noopAction;
  }

  // Construct a FSA action with a promise payload
  // and pass it down to redux-promise
  return next(nextAction(new Promise((fulfill, reject) => {
    superagent(method, url)
      .set({
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .send(JSON.stringify(body || {}))
      .then((response) => {
        // Client-side rendering goes through `response.text`
        // Server-side rendering goes through `response.res.text`
        const res = (response.xhr) ? response.text : response.res.text;
        if (res) fulfill(JSON.parse(res));
        else fulfill(res);
      }, (error) => {
        reject(error);
      });
  })));
};
