// A set of utility action creators

import { createAction } from 'redux-actions';

/**
 * This action creator is used for creating an asynchronous web request
 * The action will be passed through WebAPIMiddleware (../middlewares/api)
 */
export const webRequestAction = createAction('WEB_REQUEST');

/**
 * A special action to terminate the action chain. This is especially useful
 * for disabling further action after a web request. Note that no reducer
 * will be used to handle this action.
 */
export const noopAction = createAction('NOOP');

/**
 * A default action for handling server-side initial Redux state loading.
 * This action will pour all initial state into state.initialState. If
 * you want to do any additional parsing of initial state, define your own action creator.
 */
export const loadedInitialStateAction = createAction('LOADED_INITIAL_STATE');

// Helpers

/**
 * Construct a special payload for initial server-side rendering.
 */
export const constructInitialStatePayload = (body) => {
  return Object.assign({
    nextAction: loadedInitialStateAction,
  }, body, {
    url: `http://localhost:8080${body.url}`,
  });
};
