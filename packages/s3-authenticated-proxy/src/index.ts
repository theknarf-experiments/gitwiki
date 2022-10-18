#!/usr/bin/env -S yarn ts-node
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import s3Proxy from 's3-proxy';
import url from 'url';
import AzureAdLoginExpressMiddleware from './azure-ad-login';

// Load enviroment variables from a `.env` file if it exists
dotenv.config({ path: `.env` });

// Port config
const port = process.env.S3AUTHENTICATEDPROXY_PORT || 80;

// Configurable variables for login
const azureAdConfig = {
  redirectURI:
    process.env.S3AZUREADPROXY_REDIRECTURI ||
    `http://localhost:${port}/redirect`,
  tenantID: process.env.S3AZUREADPROXY_AZURE_TENANTID || 'common',
  clientId: process.env.S3AZUREADPROXY_AZURE_CLIENTID!,
  clientSecret: process.env.S3AZUREADPROXY_AZURE_CLIENTSECRET!,
};

// express-session config
const sessionConfig = {
  secret: process.env.S3AZUREADPROXY_SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set this to true on production
  },
};

// Configurable variables for s3
type S3Config = {
  region: string;
  overrideCacheControl: string;
  defaultKey: string;
  bucket?: string;
  profile?: string;
};

const s3Config: S3Config = {
  bucket: process.env.S3AZUREADPROXY_S3_BUCKET,
  region: process.env.S3AZUREADPROXY_S3_REGION || 'eu-west-1',
  profile: process.env.S3AZUREADPROXY_S3_PROFILE,
  overrideCacheControl: 'max-age=100000',
  defaultKey: 'index.html',
};

// Setup App
const app = express();

AzureAdLoginExpressMiddleware(azureAdConfig, sessionConfig, app);

// Taken from: https://stackoverflow.com/a/36667417
const removeQueryString = (httpUrl: any) => {
  // split url into distinct parts
  // (full list: https://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost)
  var obj = url.parse(httpUrl);

  // remove the querystring
  obj.search = obj.query = '';

  // reassemble the url
  return url.format(obj);
};

app.get('/*', (req: Request, res: Response, next: NextFunction) => {
  // Ensure that urls like https://localhost/?some=value doesn't send the `?some=value` part to the s3proxy
  req.originalUrl = removeQueryString(req.originalUrl);

  Object.defineProperty(req, 'path', {
    configurable: true,
    enumerable: true,
    get() {
      return this.get(removeQueryString(req.path));
    },
  });

  //@ts-ignore
  req.query = undefined;

  s3Proxy(s3Config)(req, res, next);
});

app.listen(port, () => {
  console.log(
    `App listening at port ${port}. (Redirect configured to ${azureAdConfig.redirectURI})`
  );
});
