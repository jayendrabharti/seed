import { OAuth2Client } from 'google-auth-library';
import { clientBaseUrl, googleClientId, googleClientSecret } from './auth';

// The validation is already done in auth.ts via validateENV
export const oAuth2Client = new OAuth2Client({
  clientId: googleClientId,
  clientSecret: googleClientSecret,
  redirectUri: `${clientBaseUrl}/auth/callback`,
});
