# deploy-to-s3

## Usage

Add the following to `targets` in your `project.json`:

```
  "targets": {
    "deploy-to-s3": {
      "executor": "@dnb/deploy-to-s3:deploy-to-s3",
      "options": {
        "bucketId": "Bucket",
				"path": "images/",
				"artifactPath": "."
      }
    }
  },
```

option | description
-------|------------
`bucketId`| The bucketId for the S3 bucket
`path`| The path in the S3 bucket to upload stuff to
`artifactPath`| The path locally in the repo from where to find files to upload

## Development

To test it locally first run:

```
yarn dummy-server
```

This should start up a dummy s3 server locally to test against.
Then add the "endpoint" config in your `project.json` setup:

```
{
  "targets": {
    "deploy-to-s3": {
      "executor": "@dnb/deploy-to-s3:deploy-to-s3",
      "options": {
        // ...
        "endpoint": "http://localhost:10001"
      }
    }
  },
}
```

Now you should be able to test the executor by running this in the root of the project:

```
yarn nx run @dnb/deploy-to-s3:deploy-to-s3 --verbose
```
