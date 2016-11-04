// Services for handling file uploads

const Promise = require('bluebird');
const AWS = require('aws-sdk');

function removeTemporary(filename) {

}

function uploadToS3(Key, Body) {
  // Only upload file to S3 in production environment
  if (process.env.NODE_ENV !== 'production') {
    console.log(`File: ${Key} sent to S3...`);
    return Promise.resolve();
  }

  // Configure AWS
  AWS.config.update({ region: 'us-east-1' });
  AWS.config.setPromisesDependency(Promise);

  const s3 = new AWS.S3();
  return s3.upload({ Key, Body, ACL: 'public-read' }).promise();
}

module.exports = {
  uploadToS3,
  removeTemporary,
};
