# Nano-Banana Chat - Vercel Deployment

Beautiful banana-themed AI Image Editor powered by Google's Nano-Banana model! 🍌

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PierrunoYT/nano-banana-chat)

**Or manually:**

1. **Fork/Clone this repository**

2. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **That's it!** Your banana-themed AI Image Editor is live!

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Start local development server
npm run dev
```

Visit `http://localhost:3000`

## Features

✅ **Pure Vercel Deployment**
- Serverless API routes in `/api/generate-image.js`
- Static frontend served from `/public/`
- No Cloudflare dependencies
- CORS configured for cross-origin requests

✅ **Beautiful Banana Theme**
- Seamless banana pattern background
- Complete yellow UI theme
- Download functionality for generated images
- "Made with 🍌" footer

✅ **Powered by Nano-Banana**
- Google's Nano-Banana AI model via Replicate
- User brings their own Replicate API token
- Secure token handling (never stored server-side)

## Architecture

1. **Frontend:** Static React app with Tailwind CSS (`/public/`)
2. **Backend:** Vercel serverless function (`/api/generate-image.js`)
3. **AI Model:** Google Nano-Banana via Replicate API
4. **Storage:** Direct Replicate URLs (no server storage needed)

## Environment Variables

None required! Users provide their own Replicate API tokens via the UI for maximum security.

## Tech Stack

- **Frontend:** Vanilla React + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **AI:** Google Nano-Banana via Replicate
- **Deployment:** Vercel

Enjoy your banana-themed AI image editor! 🎨🍌✨