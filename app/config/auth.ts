export const AUTH_CONFIG = {
  miro: {
    clientId: process.env.NEXT_PUBLIC_MIRO_APP_ID,
    redirectUri: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/miro` : 'http://localhost:3001/api/auth/callback/miro',
    oauthUrl: 'https://miro.com/oauth/authorize',
    scopes: [
      'boards:read',
      'boards:write',
      'boards:share',
    ].join(' '),
  },
} as const;

// Server-side only config - do not import this in client components
export const SERVER_AUTH_CONFIG = {
  miro: {
    clientSecret: process.env.MIRO_CLIENT_SECRET,
    tokenUrl: 'https://api.miro.com/v1/oauth/token',
  },
} as const; 