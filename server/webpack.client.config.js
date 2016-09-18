// This file is used for configuring Webpack bundler for client.

const generateConfig = require('./webpack.client.config.template');

// Front-end locale mappings
const languages = {
  "zh-CN": require('./webapp/locales/zh-CN.json'),
  en: null,
};

module.exports = Object.keys(languages).map((langName) => {
  return generateConfig(langName, languages[langName]);
});
