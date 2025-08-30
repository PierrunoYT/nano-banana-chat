# Nano-Banana Chat 🍌

A beautiful banana-themed AI Image Editor powered by Google's Nano-Banana model via Replicate.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PierrunoYT/nano-banana-chat)

## ✨ Features

- 🍌 **Beautiful Banana Theme** - Seamless banana pattern background with complete yellow UI
- 🎨 **AI Image Generation** - Powered by Google's Nano-Banana model via Replicate
- ⬇️ **Download Functionality** - Save generated images with smart filenames
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🔐 **Secure** - Users provide their own Replicate API tokens (never stored server-side)
- 🚀 **Fast Deployment** - One-click Vercel deployment

## 🎯 Tech Stack

- **Frontend:** Vanilla React + Tailwind CSS
- **Backend:** Vercel Serverless Functions
- **AI Model:** Google Nano-Banana via Replicate API
- **Deployment:** Vercel

## 🚀 Quick Deploy

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PierrunoYT/nano-banana-chat)

### Manual Deploy
1. Fork this repository
2. Connect to Vercel: `npx vercel --login`
3. Deploy: `npm run deploy`

## 💻 Local Development

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Clone and start:**
   ```bash
   git clone https://github.com/PierrunoYT/nano-banana-chat.git
   cd nano-banana-chat
   npm run dev
   ```

3. **Visit:** `http://localhost:3000`

## 🔑 Getting Started

1. **Get a Replicate API Token:**
   - Sign up at [replicate.com](https://replicate.com)
   - Get your token from [API settings](https://replicate.com/account/api-tokens)

2. **Use the App:**
   - Enter your Replicate API token when prompted
   - Upload an image or select from examples
   - Describe your desired edits
   - Download your AI-generated results!

## 🏗️ Architecture

```
├── api/
│   └── generate-image.js    # Vercel serverless function
├── public/
│   ├── index.html          # Main app page
│   ├── app.js              # React frontend
│   ├── banana-pattern.png  # Background pattern
│   └── nanobanana.png      # Logo
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies
```

## 🔒 Security

- **No server-side token storage** - Users provide tokens via UI
- **CORS configured** for secure cross-origin requests
- **Client-side token management** with localStorage

## 🎨 Customization

The banana theme can be customized by modifying:
- `banana-pattern.png` - Background pattern
- `nanobanana.png` - Logo
- Yellow color scheme in `app.js`

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

**Made with 🍌 by the community**

Enjoy creating amazing AI-generated images with the beautiful banana-themed interface!
