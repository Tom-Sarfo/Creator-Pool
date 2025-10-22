# Environment Setup Guide

## Step 1: Create .env file

Create a `.env` file in your project root with your Google Cloud credentials:

```bash
# YouTube API Configuration
YOUTUBE_CLIENT_ID=your_actual_client_id_from_google_cloud
YOUTUBE_CLIENT_SECRET=your_actual_client_secret_from_google_cloud
YOUTUBE_REDIRECT_URI=http://localhost:5178/api/youtube/callback
```

## Step 2: Get Your Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID
5. Copy the Client ID and Client Secret
6. Paste them into your `.env` file

## Step 3: Verify Redirect URI

Make sure your Google Cloud Console has this exact redirect URI:

- `http://localhost:5178/api/youtube/callback`

## Step 4: Test the Setup

1. Start the development server: `npm run dev`
2. Visit: `http://localhost:5178/youtube-test`
3. Click "Test Auth URL Generation" to verify credentials
4. Click "Connect YouTube Channel" to test OAuth flow

## Troubleshooting

**Port Issues:**

- Vite is now configured to use port 5178
- If you still see a different port, restart the dev server

**OAuth Errors:**

- Check that redirect URI matches exactly
- Ensure OAuth consent screen is configured
- Verify client ID and secret are correct

**Environment Variables:**

- Make sure `.env` file is in the project root
- Restart the dev server after changing `.env`
- Check that variables are loaded: visit `/youtube-test` and check the environment check section
