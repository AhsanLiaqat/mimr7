var S3FS = require('s3fs');

module.exports.library = new S3FS('crisishub/library', {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET
});