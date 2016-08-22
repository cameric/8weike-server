import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise';
import nock from 'nock';
import { expect } from 'chai';

import apiMiddleware from '../../../webapp/middlewares/api';
import { webRequestAction, noopAction, loadedInitialStateAction, constructInitialStatePayload }
  from '../../../webapp/actions/utils';

const middlewares = [
  apiMiddleware,
  promiseMiddleware
];
const mockCreateStore = configureMockStore(middlewares);

describe('API request middleware test', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('handles a GET request', (done) => {
    const mockHost = 'http://test.8weike.com';
    nock(mockHost)
        .get('/user')
        .reply(200, { user: { phone: '123456789' } });

    const store = mockCreateStore();
    const mockGetRequestAction = webRequestAction({
      url: `${mockHost}/user`,
      method: 'GET',
      nextAction: noopAction,
    });
    const expectedAction = noopAction({
      user: { phone: '123456789' },
    });

    store.dispatch(mockGetRequestAction).then(() => {
      expect(store.getActions()[0]).to.deep.equal(expectedAction);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('handles a POST request', (done) => {
    const mockHost = 'http://test.8weike.com';
    nock(mockHost)
        .post('/user')
        .reply(201, function(uri, requestBody) {
          return requestBody;
        });

    const store = mockCreateStore();
    const mockGetRequestAction = webRequestAction({
      url: `${mockHost}/user`,
      method: 'POST',
      body: { user: { phone: '123456789' } },
      nextAction: noopAction,
    });
    const expectedAction = noopAction({
      user: { phone: '123456789' },
    });

    store.dispatch(mockGetRequestAction).then(() => {
      expect(store.getActions()[0]).to.deep.equal(expectedAction);
      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('loads initial state from server', (done) => {
    const mockHost = 'http://localhost:8080';
    nock(mockHost)
        .get('/user')
        .reply(200, { user: { phone: '123456789' } });

    const store = mockCreateStore({ pageInitialState: {} });
    const mockLoadInitialStateAction = webRequestAction(constructInitialStatePayload({
      url: `/user`,
      method: 'GET',
    }));
    const expectedAction = loadedInitialStateAction({
      user: { phone: '123456789' },
    });

    store.dispatch(mockLoadInitialStateAction).then(() => {
      expect(store.getActions()[0]).to.deep.equal(expectedAction);
      done();
    }).catch((err) => {
      done(err);
    });
  });
});
