# Netlify OAuth Setup Guide

This guide helps you set up automatic Netlify deployment with OAuth authentication.

## Step 1: Register OAuth Application with Netlify

1. Go to https://app.netlify.com
2. Click on your profile icon (top right) → **User settings**
3. Go to **Applications** → **Authorize application**
4. Under "Personal access tokens", create a new token:
   - Name: "Website Generator"
   - Scopes: Select `deploy`
   - Copy the generated token

## Step 2: Create OAuth Application on Netlify

1. Go to https://app.netlify.com/user/applications
2. Click **New OAuth Application** (or scroll to "OAuth applications")
3. Fill in the form:
   - **Name:** Website Generator
   - **Description:** Automatic website deployment from app
   - **Redirect URI:** `http://localhost:3000/netlify-callback` (for development)
   - For production: `https://yourdomain.com/netlify-callback`

4. After creating, you'll get:
   - **Client ID** - Copy this
   - **Client Secret** - Copy this (keep it safe!)

## Step 3: Add Credentials to Your App

### For Development:

Create a `.env.local` file in the `frontend` folder:

```
REACT_APP_NETLIFY_CLIENT_ID=your_client_id_here
REACT_APP_NETLIFY_REDIRECT_URI=http://localhost:3000/netlify-callback
```

### For Production:

Update `.env` file with your production domain:

```
REACT_APP_NETLIFY_CLIENT_ID=your_client_id_here
REACT_APP_NETLIFY_REDIRECT_URI=https://yourdomain.com/netlify-callback
```

## Step 4: Update Your App's Netlify TOML

Create a `netlify.toml` file in the `frontend` folder:

```toml
[build]
  command = "npm run build"
  publish = "build"

[dev]
  command = "npm start"
  port = 3000

# OAuth redirect settings
[[redirects]]
  from = "/netlify-callback"
  to = "/?token=:token"
  status = 200
  force = true
```

## Step 5: Add Callback Route to App.js

In your `src/App.js`, add the callback route:

```jsx
import NetlifyCallback from './pages/NetlifyCallback';

// In your routes:
<Route path="/netlify-callback" element={<NetlifyCallback />} />
```

## Step 6: Start Using

1. Start your app: `npm start`
2. Generate a website
3. Click "Download & Deploy"
4. Click "Connect Netlify Account"
5. Authorize and return to your app
6. Click "Deploy Now" - your site is live in seconds!

---

## Environment Variables Reference

### Required for OAuth:
- `REACT_APP_NETLIFY_CLIENT_ID` - Your Netlify OAuth client ID

### Optional:
- `REACT_APP_NETLIFY_REDIRECT_URI` - Redirect after OAuth (defaults to current origin)

---

## Troubleshooting

### "OAuth client not configured"
- Check that `REACT_APP_NETLIFY_CLIENT_ID` is set in `.env.local`
- Make sure you created the OAuth application on Netlify
- Restart your dev server after changing .env files

### "Redirect URI mismatch"
- Update the redirect URI in Netlify OAuth settings
- Must match exactly: `http://localhost:3000/netlify-callback` for dev
- For production, use your actual domain

### "Failed to authenticate"
- Check browser console (F12) for errors
- Make sure your Netlify account is active
- Try disconnecting and reconnecting

### "Deployment fails"
- Check that your site name is unique (or let Netlify generate one)
- Ensure all three files (HTML, CSS, JS) are included
- Check network tab in browser console for specific errors

---

## Security Notes

🔒 **Never commit `.env.local` to git**
- Add `.env.local` to your `.gitignore` file
- Each developer should have their own local .env file

🔒 **Keep your Client Secret safe**
- Don't expose it in frontend code
- Only use Client ID in frontend (it's public)
- For production, consider using a backend proxy

🔒 **OAuth Token Storage**
- Tokens are stored in `localStorage`
- They're not accessible from other websites (same-origin policy)
- Consider adding expiration and refresh logic for production

---

## Getting Help

- Netlify Docs: https://docs.netlify.com/
- OAuth Documentation: https://docs.netlify.com/api/get-started/#authentication
- Community: https://community.netlify.com/

---

## Production Deployment

When deploying to production:

1. Update redirect URI in Netlify OAuth settings
2. Set `REACT_APP_NETLIFY_CLIENT_ID` in your hosting platform's environment variables
3. Update `netlify.toml` with your production domain
4. Test OAuth flow in production

---

*Last Updated: April 29, 2026*
