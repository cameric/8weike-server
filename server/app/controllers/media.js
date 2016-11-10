const mediaModel = require('../models/media');

function updateMedia(req, res, next) {
  const mediaId = req.params.mediaId;

  return mediaModel.updateById(mediaId, req.body)
      .then(() => { res.sendStatus(200); })
      .error((err) => { next(Object.assign(err, { status: 400 })); })
      .catch(next);
}

module.exports = {
  updateMedia,
};
