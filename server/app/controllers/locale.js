// Controller for locale endpoints
// Note that we use cookie to store locales

const config = require('../config/config');

function set(req, res, next) {
  const { locale } = req.body;
  // Attach a locale cookie to client
  res.cookie(config.localeCookie, locale, config.express.cookie);
  res.status(200).send();
}

function get(req, res, next) {
  // getLocale is attached to req through i18n middleware
  res.status(200).send({ locale: req.getLocale() });
}

module.exports = {
  set,
  get,
};
