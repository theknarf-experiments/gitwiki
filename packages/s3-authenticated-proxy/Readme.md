# s3-authenticated-proxy

Reusable application in a Docker container that will use Azure AD to authenticate a user, and then proxy files from an s3 bucket.

## Setup

The application needs to be configured correctly to work.
This is a list of env-variables you can set to configure the application.
Some of them might be required.

Variable name|Example|Description
-------------|-------|-----------
S3AZUREADPROXY_REDIRECTURI|`http://localhost:3000/redirect`|The Redirect url sent to Azure AD for where to redirect the user back after login
S3AZUREADPROXY_AZURE_TENANTID|common|You Azure tennant ID.
S3AZUREADPROXY_AZURE_CLIENTID||Client ID configured for your application in Azure
S3AZUREADPROXY_AZURE_CLIENTSECRET||Client Secret configured for your application in Azure
S3AZUREADPROXY_SESSION_SECRET||A secret key used by the application to encrypt sessions
S3AZUREADPROXY_S3_BUCKET||The name of the s3 proxy you want to proxy
S3AZUREADPROXY_S3_REGION|eu-west-1|AWS Region where the s3 proxy resides, defaults to `eu-west-1`
S3AZUREADPROXY_S3_PROFILE|default|AWS profile used for authentication, defaults to `default`

For testing locally you can set these variables in an `.env` file.
For production set them as enviroment variables on the Docker container.

## Debugging

You can activate debug output from this app by setting an env-variable as following:

```
DEBUG=s3-azure-ad-proxy
```

or for all libraries to output debug info:

```
DEBUG=*
```
