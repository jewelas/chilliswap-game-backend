const AWS = require('aws-sdk');



// Enter copied or downloaded access ID and secret key here
const ACCESS_KEY_ID = 'AKIATZTJBJ5GTUCXD3FG';
const SECRET_ACCESS_KEY = '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';
const AWS_REGION = 'ap-southeast-1';
const BUCKET_NAME = 'knfts';


  // Configure AWS to use promise
  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

  // Create an s3 instance
  const s3 = new AWS.S3();


  

module.exports = s3