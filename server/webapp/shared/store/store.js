// The overall Redux store

import configureStoreDev from './store.dev';
import configureStoreProd from './store.prod';

let configureStore;
if (process.env.NODE_ENV === 'development') {
  configureStore = configureStoreDev;
} else {
  configureStore = configureStoreProd;
}

export default configureStore;
