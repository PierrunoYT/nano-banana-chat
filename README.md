# Nano-Banana AI Image Editor 🍌

A modern, privacy-focused AI Image Editor powered by Google's Nano-Banana model. Transform your images with natural language descriptions using either Replicate or FAL.ai as your AI provider.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PierrunoYT/nano-banana-chat)

## ✨ Features

- 🍌 **Beautiful Banana Theme** - Clean yellow UI with animated banana GIF
- 🤖 **Dual AI Providers** - Choose between Replicate or FAL.ai 
- 🎨 **Natural Language Editing** - Describe edits in plain English
- 📱 **Responsive Design** - Optimized for both desktop and mobile
- 🔐 **Privacy First** - Your API tokens, your data, your control
- ⚡ **Client-Side Processing** - Images processed in your browser
- 📊 **Analytics & Performance** - Built-in Vercel Analytics and Speed Insights
- 🚀 **One-Click Deploy** - Deploy to Vercel instantly

## 🔒 Security & Privacy

- 🔑 **Your API Keys** - Uses your personal tokens, you control access and costs
- 🚫 **No Data Storage** - Images and prompts aren't saved or logged by the app
- 🔒 **Client-Side Processing** - Images processed in your browser, never uploaded to unknown servers
- 📊 **Anonymous Analytics** - Basic usage analytics to improve experience, no personal data stored

## 🎯 Tech Stack

- **Framework:** Next.js 15.5.2 with App Router
- **Language:** TypeScript with comprehensive type definitions  
- **Styling:** Tailwind CSS with custom banana theme
- **State Management:** React Context API with useReducer
- **AI Providers:** Replicate & FAL.ai integration
- **Analytics:** Vercel Analytics & Speed Insights
- **Deployment:** Vercel

## 🚀 Quick Deploy

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/PierrunoYT/nano-banana-chat)

### Manual Deploy
1. Fork this repository
2. Connect to Vercel: `npx vercel --login`
3. Deploy: `npm run build && npx vercel --prod`

## 💻 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PierrunoYT/nano-banana-chat.git
   cd nano-banana-chat
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Visit:** `http://localhost:3000`

## 🔑 Getting Started

### 1. Get API Tokens

Choose one or both providers:

**Replicate:**
- Sign up at [replicate.com](https://replicate.com)
- Get your token: [API settings](https://replicate.com/account/api-tokens?new-token-name=nano-banana-editor)

**FAL.ai:**
- Sign up at [fal.ai](https://fal.ai)
- Get your token: [Dashboard](https://fal.ai/dashboard/keys)

### 2. Use the App

1. Click the settings gear in the yellow banner
2. Choose your AI provider (Replicate or FAL.ai)
3. Enter your API token
4. Upload an image (JPG, PNG, GIF • Max 10MB)
5. Describe your desired edits in natural language
6. Download your AI-generated results!

## 🏗️ Architecture

```
nano-banana-chat/
├── app/
│   ├── api/
│   │   ├── generate-image/         # Replicate API route
│   │   └── generate-image-fal/     # FAL.ai API route
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout with metadata
│   └── page.tsx                    # Main app page
├── components/
│   ├── ui/                         # Reusable UI components  
│   ├── ChatInterface.tsx           # Chat conversation UI
│   ├── ImageUpload.tsx             # Upload and starter interface
│   ├── PoweredByBanner.tsx         # Header banner with settings
│   ├── SecurityFeatures.tsx        # Security information cards
│   └── SettingsPanel.tsx           # API configuration modal
├── contexts/
│   └── AppContext.tsx              # Centralized state management
├── lib/
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # Utility functions
├── public/
│   ├── preview.png                 # Social media preview image
│   ├── banana-pattern.png          # Background pattern
│   └── nanobanana.png              # Logo
└── package.json                    # Dependencies and scripts
```

## 🎨 Key Components

### State Management
- **Context API** with useReducer for centralized state
- **TypeScript** interfaces for type safety
- **localStorage** integration for API token persistence

### AI Integration
- **Replicate API** - Primary provider with Nano-Banana model
- **FAL.ai API** - Alternative provider for flexibility
- **Dynamic imports** for optimal bundle size
- **Error handling** with user-friendly feedback

### UI/UX Features
- **Drag & Drop** file upload with visual feedback
- **Real-time chat** interface for editing conversations
- **Image download** functionality with smart filenames
- **Responsive design** with mobile-first approach

## 📊 Analytics & Monitoring

The app includes:
- **Vercel Analytics** - Visitor tracking and user behavior insights
- **Speed Insights** - Performance monitoring and Core Web Vitals
- **Privacy-compliant** - Anonymous analytics with user disclosure

## 🎨 Customization

### Theming
- Modify colors in `globals.css` and Tailwind classes
- Replace `banana-pattern.png` for different background
- Update `nanobanana.png` for custom logo
- Change `preview.png` for social media preview

### AI Providers
- Add new providers in `/api/` directory
- Update provider selection in `SettingsPanel.tsx`
- Extend types in `lib/types.ts`

## 🚀 Performance

- **Optimized bundle** with dynamic imports
- **Image optimization** with Next.js Image component
- **Client-side processing** for better privacy and speed
- **Responsive images** with proper sizing
- **Speed monitoring** with built-in insights

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Resources

- [Nano-Banana Model](https://replicate.com/google/nano-banana) - Google's image editing AI
- [Replicate Documentation](https://replicate.com/docs) - API reference
- [FAL.ai Documentation](https://fal.ai/docs) - Alternative AI provider
- [Next.js Documentation](https://nextjs.org/docs) - Framework guide
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

---

**Made with 🍌 by the community**

Transform your images with AI using natural language - no complex tools, just describe what you want!