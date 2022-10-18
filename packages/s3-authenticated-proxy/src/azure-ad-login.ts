import * as msal from '@azure/msal-node';
import { AuthorizationCodeRequest, CryptoProvider, AuthorizationUrlRequest, Configuration } from "@azure/msal-node";
import { Request, Response, NextFunction, Application } from 'express';
import session, { Session, SessionOptions } from "express-session";
import debugLib from 'debug';

const debug = debugLib('s3-azure-ad-proxy');

export type RequestWithPKCE = Request & {
  session: Session & {
    pkceCodes: {
      challengeMethod: string,
      challenge?: string,
      verifier?: string
    }
    isAuthenticated?: boolean,
  }
};

interface AzureAdConfig {
  redirectURI : string;
  tenantID : string;
  clientId : string;
  clientSecret : string;
}

// Handles login through Azure AD
const AzureAdLoginExpressMiddleware = (config : AzureAdConfig, sessionConfig : SessionOptions, app : Application) => {

  // Create msal application object
  const fullConfig : Configuration = {
    auth: {
      clientId: config.clientId,
      authority: `https://login.microsoftonline.com/${config.tenantID}`,
      clientSecret: config.clientSecret,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel, message) {
          debug(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      }
    }
  };

  const client = new msal.ConfidentialClientApplication(fullConfig);

  app.use(session(sessionConfig));

  // Initialize CryptoProvider instance
  const cryptoProvider = new CryptoProvider();

  const acquireAzureADToken = async (request: RequestWithPKCE, response : Response) => {
    // Add PKCE code verifier to token request object
    const tokenRequest: AuthorizationCodeRequest = {
      code: request.query.code as string,
      scopes: ["user.read"],
      redirectUri: config.redirectURI,
      codeVerifier: request.session.pkceCodes.verifier, // PKCE Code Verifier
      clientInfo: request.query.client_info as string
    };
    const redirectBackURLAfterLogin = request.query.state as string || '/';

    try {
      await client.acquireTokenByCode(tokenRequest);

      request.session.isAuthenticated = true;
      response.redirect(redirectBackURLAfterLogin);
    } catch(error : unknown) {
      debug(error);
      response.status(500).send(error);
    }
  }

  const redirectToAzureLogin = async (request: RequestWithPKCE, response : Response) => {
    // Generate PKCE Codes before starting the authorization flow
    const { verifier, challenge } = await cryptoProvider.generatePkceCodes();

    // create session object if does not exist
    if (!request.session.pkceCodes) {
      request.session.pkceCodes = {
        challengeMethod: 'S256'
      };
    }

    // Set generated PKCE Codes as session vars
    request.session.pkceCodes.verifier = verifier;
    request.session.pkceCodes.challenge = challenge;

    // Add PKCE code challenge and challenge method to authCodeUrl request object
    const authCodeUrlParameters: AuthorizationUrlRequest = {
      scopes: ["user.read"],
      redirectUri: config.redirectURI,
      codeChallenge: request.session.pkceCodes.challenge, // PKCE Code Challenge
      codeChallengeMethod: request.session.pkceCodes.challengeMethod, // PKCE Code Challenge Method
      state: request.originalUrl,
    };

    // Get url to sign user in
    response.redirect(
      await client.getAuthCodeUrl(authCodeUrlParameters)
    );
  }

  const middleware  = async (request: RequestWithPKCE, response : Response, next : NextFunction) => {
    // If we have been redirected back from Azure AD,
    // at this point we can acquire a token and login is done.
    if(
      typeof request.query.code !== 'undefined' &&
      typeof request.query.client_info !== 'undefined'
    ) {
      return await acquireAzureADToken(request, response);
    }

    // Check if we're allready logged inn
    if(request.session.isAuthenticated === true) {
      return next();
    }

    // If we're at this point in the code then we haven't yet logged inn.
    // This prepares login and redirects us to Azure's signin screen.
    try {
      await redirectToAzureLogin(request, response);
    } catch( error ) {
      debug(error);
      response.status(500).send('Something went wrong trying to redirect you to the login screen');
    }
  }

  app.use((middleware as any));
}

export default AzureAdLoginExpressMiddleware;
