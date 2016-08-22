const expect = require('chai').expect;
const utilActions = require('../../../webapp/actions/utils');

describe('Utils Action Creators test', () => {
  it('creates a normal redux-action for web request', () => {
    const expectedAction = {
      type: 'WEB_REQUEST',
      payload: {
        url: '/login',
        method: 'POST',
        body: { cellphone: '123456789'}
      },
    };

    expect(utilActions.webRequestAction(expectedAction.payload))
      .to.deep.equal(expectedAction);
  });

  it('construct initial state payload correctly', () => {
    const initialPayload = ({
      url: '/login',
      method: 'POST',
      body: { cellphone: '123456789'},
    });

    const expectedAction = {
      type: 'WEB_REQUEST',
      payload: {
        url: 'http://localhost:8080/login',
        method: 'POST',
        body: { cellphone: '123456789'},
        nextAction: utilActions.loadedInitialStateAction,
      },
    };

    expect(utilActions.webRequestAction(utilActions.constructInitialStatePayload(initialPayload)))
      .to.deep.equal(expectedAction);
  });
});
