// The overall Redux store

import configureStoreDev from './store.dev';
import configureStoreProd from './store.prod';

// Distinguish between client and server
const nodeEnv = process.env.NODE_ENV || global.NODE_ENV;

const configureStore = (nodeEnv === 'development') ? configureStoreDev : configureStoreProd;

export default configureStore;
