# Google Cloud OAuth Setup - Fix "Access Blocked" Error

## The Issue

You're getting "Access blocked: Creator Pool has not completed the Google verification process" because your OAuth consent screen is set to "External" but you haven't added test users.

## Quick Fix - Add Test Users

### Step 1: Go to OAuth Consent Screen

1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to "APIs & Services" → "OAuth consent screen"

### Step 2: Add Test Users

1. Scroll down to the "Test users" section
2. Click "Add users"
3. Add your email address (the one you're using to test the app)
4. Click "Save"

### Step 3: Test Again

1. Go back to your app: http://localhost:5178/youtube-test
2. Click "Connect YouTube Channel"
3. You should now be able to authorize the app

## Alternative: Change to Internal (If You Have Google Workspace)

If you have a Google Workspace account:

1. In "OAuth consent screen"
2. Change "User Type" from "External" to "Internal"
3. Save changes

## What This Means

- **External apps** require Google verification for public use
- **Test users** can access unverified external apps
- **Internal apps** (Google Workspace only) don't need verification

## After Adding Test User

Once you add yourself as a test user, the OAuth flow should work perfectly! You'll be able to:

1. ✅ Connect your YouTube channel
2. ✅ Access unlisted videos
3. ✅ Create prediction pools with real video data

## Next Steps

After fixing the OAuth issue:

1. Test the connection flow
2. Verify you can see your unlisted videos
3. Create a prediction pool with real YouTube data
4. Move on to integrating this into the main app

The YouTube integration is working correctly - it's just the Google OAuth consent screen that needs the test user added!
