# Vercel Deployment Guide

This AI Image Editor is now Vercel-ready! 🍌

## Quick Deploy to Vercel

1. **Fork/Clone this repository**

2. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **That's it!** Your banana-themed AI Image Editor is live!

## Local Development

```bash
# Install Vercel CLI
npm install -g vercel

# Start local development server
npm run vercel-dev
```

## Features

✅ **Full Vercel Compatibility**
- Serverless API routes in `/api/generate-image.js`
- Static frontend served from `/public/`
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

## How it Works

1. **Frontend:** Static React app with Tailwind CSS
2. **Backend:** Vercel serverless function at `/api/generate-image`
3. **AI Model:** Google Nano-Banana via Replicate API
4. **Storage:** No server storage needed - uses Replicate URLs directly

## Environment Variables

No environment variables needed! Users provide their own Replicate API tokens via the UI.

Enjoy your banana-themed AI image editor! 🎨🍌