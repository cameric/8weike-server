// Services for handling file uploads

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const config = require('../config/config');

const unlink = Promise.promisify(fs.unlink);

function removeTemporary(tmpFilename) {
  const tmpFilePath = path.join(config.upload.diskLocation, tmpFilename);
  return unlink(tmpFilePath);
}

function uploadToS3(Bucket, Key, Body) {
  // Only upload file to S3 in production environment
  if (process.env.NODE_ENV !== 'production') {
    console.log(`File: ${Key} sent to S3...`);
    const fakeResponse = {
      Key,
      Location: `https://8weike-media.s3.amazonaws.com/${Key}`,
    };
    return Promise.resolve(fakeResponse);
  }

  // Configure AWS
  AWS.config.update({ region: 'us-east-1' });
  AWS.config.setPromisesDependency(Promise);

  const s3 = new AWS.S3();
  return s3.upload({ Bucket, Key, Body, ACL: 'public-read' }).promise();
}

module.exports = {
  uploadToS3,
  removeTemporary,
};
