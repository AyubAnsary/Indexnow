import axios from 'axios';
import crypto from 'crypto';
import { DispatchedEngineResult, GoogleServiceAccount } from './types';

/**
 * Creates a signed JWT for a Google Service Account to obtain an OAuth 2.0 Access Token.
 */
function createGoogleJwt(serviceAccount: GoogleServiceAccount): string {
  const header = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedClaimSet = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsignedToken);
  const signature = signer.sign(serviceAccount.private_key, 'base64url');

  return `${unsignedToken}.${signature}`;
}

/**
 * Exchanges a signed JWT for an OAuth 2.0 Bearer Access Token.
 */
export async function getGoogleAccessToken(serviceAccount: GoogleServiceAccount): Promise<string> {
  const jwtToken = createGoogleJwt(serviceAccount);
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token';

  const response = await axios.post(
    tokenUri,
    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwtToken,
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
}

/**
 * Submits a single URL directly to Google Indexing API (URL_UPDATED notification).
 */
export async function submitToGoogleIndexingApi(
  url: string,
  serviceAccount: GoogleServiceAccount,
  type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'
): Promise<DispatchedEngineResult> {
  const timestamp = new Date().toISOString();
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

  try {
    const accessToken = await getGoogleAccessToken(serviceAccount);

    const payload = {
      url: url,
      type: type,
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 8000,
      validateStatus: () => true,
    });

    const isSuccess = response.status === 200;
    let message = `HTTP ${response.status}: `;

    if (isSuccess) {
      message += 'Successfully pushed to Google Indexing API.';
    } else {
      const apiErr = response.data?.error?.message || response.statusText;
      message += `Google API Error: ${apiErr}`;
    }

    return {
      engine: 'google_api',
      endpoint,
      success: isSuccess,
      statusCode: response.status,
      message,
      timestamp,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Google API Request Failed';
    return {
      engine: 'google_api',
      endpoint,
      success: false,
      statusCode: 0,
      message: `Auth / Request Exception: ${errorMsg}`,
      timestamp,
    };
  }
}
