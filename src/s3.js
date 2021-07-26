const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../", ".env") });
//load S3 service object
const S3 = require("aws-sdk/clients/s3");
//create service object
const s3 = new S3({
  region: process.env.AWS_BUCKET_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fs = require("fs");
/*
upload a file 
delete a file 
get a file 
*/
exports.uploadobject = async (file) => {
  /*\
    file.stream is a readeable stream 
    **so get the data from buffer memory and send it to aws 
  */
  const chunks = [];
  for await (let chunk of file.stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: buffer,
    Key: file.originalName,
    ContentType: file.clientReportedMimeType,
    ACL: "public-read",
  };

  return s3.upload(params).promise();
};
exports.getobject = async (file) => {
  const download = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file,
  };
  return s3.getObject(download).promise();
};

exports.deleteobject = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file,
  };
  return s3.deleteObject(params).promise();
};
