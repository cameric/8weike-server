// The overall Redux store

import configureStoreDev from './store.dev';
import configureStoreProd from './store.prod';

// Distinguish between client and server
const nodeEnv = process.env.NODE_ENV || global.NODE_ENV;

let configureStore;
if (nodeEnv === 'development') {
  configureStore = configureStoreDev;
} else {
  configureStore = configureStoreProd;
}

export default configureStore;
