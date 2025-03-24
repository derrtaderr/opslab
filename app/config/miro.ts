import { AUTH_CONFIG } from './auth';

export const MIRO_CONFIG = {
  APP_ID: AUTH_CONFIG.miro.clientId,
  BOARD_ID: process.env.NEXT_PUBLIC_MIRO_BOARD_ID,
  API_URL: 'https://api.miro.com/v2',
  EMBED_URL: 'https://miro.com/app/live-embed',
  AUTH: {
    OAUTH_URL: AUTH_CONFIG.miro.oauthUrl,
    REDIRECT_URI: AUTH_CONFIG.miro.redirectUri,
    SCOPES: AUTH_CONFIG.miro.scopes,
  },
} as const; 