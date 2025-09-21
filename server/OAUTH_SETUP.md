# OAuth Setup Instructions

## Environment Variables Required

Add these environment variables to your `.env` file in the server directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:5000/api/auth/google/callback"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
LINKEDIN_CALLBACK_URL="http://localhost:5000/api/auth/linkedin/callback"

# Session
SESSION_SECRET="your-session-secret-key"

# Frontend URL
FRONTEND_URL="http://localhost:5173"
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
6. Copy the Client ID and Client Secret to your `.env` file

## LinkedIn OAuth Setup

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. In the "Auth" tab, add redirect URLs:
   - `http://localhost:5000/api/auth/linkedin/callback` (development)
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)
4. Request access to `r_emailaddress` and `r_liteprofile` scopes
5. Copy the Client ID and Client Secret to your `.env` file

## Database Migration

After setting up the environment variables, run the database migration:

```bash
cd server
npx prisma migrate dev --name add-oauth-fields
npx prisma generate
```

## Testing

1. Start the backend server: `npm run dev`
2. Start the frontend: `npm run dev`
3. Go to the login page and click "Sign In with Google" or "Sign In with LinkedIn"
4. Complete the OAuth flow and you should be redirected to the dashboard

## Production Deployment

For production deployment, make sure to:

1. Update the callback URLs in your OAuth provider settings
2. Set `NODE_ENV=production` in your environment
3. Use HTTPS for all URLs
4. Set secure session cookies
