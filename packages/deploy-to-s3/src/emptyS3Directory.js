const AWS = require('aws-sdk');

/*
 * emptyS3Directory
 *
 *   Helper function to delete the content of a directory in S3
 *   It'll loop through all of the files in a directory and delete them
 *
 * @param {object} client - An instanciated S3 client
 * @param {string} bucket - The bucketId of the S3 bucket
 * @param {string} dir - The directory inside the S3 bucket to delete
 *
 */
async function emptyS3Directory(client, bucket, dir) {
  // Find objects in bucket and folder to delete
  const listedObjects = await client.listObjectsV2({
    Bucket: bucket,
    Prefix: dir,
  }).promise();

  if (listedObjects.Contents.length === 0)
    return;

  // Delete objects
  await client.deleteObjects({
    Bucket: bucket,
    Delete: {
      Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
    }
  }).promise();

  // Walk recursivly if needed
  if (listedObjects.IsTruncated)
    await emptyS3Directory(client, bucket, dir);
}

exports.default = emptyS3Directory;
