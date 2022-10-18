const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs')
const AWS = require('aws-sdk');
const emptyS3Directory = require('./emptyS3Directory.js').default;

const Executor = async ( options, context ) => {
	if(options.bucketId == "") {
		console.error("Missing property bucketId");
		return { success: false };
	}
	if(options.path == "") {
		console.error("Missing property path");
		return { success: false };
	}

  console.info(`Executing "upload-to-s3", uploading files to s3 bucket ("${options.bucketId}")`);

  var clientConfig = {
		s3ForcePathStyle: true,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'S3RVER',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'S3RVER',
  }

  // This option is used for testing against a local S3 instance
  if(options.endpoint !== "") {
    clientConfig.endpoint = new AWS.Endpoint(options.endpoint);
  }

  const client = new AWS.S3(clientConfig);

	if(options.verbose) {
		// TODO: remove this listing as its only for debug purposes
		const listedObjects = await client.listObjectsV2({ Bucket: options.bucketId }).promise();
		console.log(listedObjects);
	}

	try {
		// Step 1: Delete anything allready in the directory in the S3 bucket
		await emptyS3Directory(client, options.bucketId, options.path);

		// Step 2: Upload new assets
		// TODO: find assets locally and loop over and upload all of them
		const files = ['image.png'];

		await Promise.all(
			files.map((file) => {
				console.log(`- Uploading "${options.path}${file}"`);
				return client.upload({
					Key: `${options.path}${file}`,
					Bucket: options.bucketId,
					Body: fs.createReadStream(`./${file}`)
				}).promise();
			})
		);

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false };
	}
}

exports.default = Executor;
