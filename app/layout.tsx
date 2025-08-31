import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://nanobanana.food"),
  title: "Nano-Banana - AI Image Editor | Google's Latest Image Generation Model",
  description: "Free AI image editor using Google's Nano-Banana model. Transform, edit, and enhance images with natural language prompts. No signup required. Compare Replicate vs FAL providers.",
  keywords: "AI image editor, Nano-Banana, Google image AI, free image editing, AI photo editor, image generation, natural language editing, Replicate, FAL",
  openGraph: {
    type: "website",
    url: "https://nanobanana.food/",
    title: "Free AI Image Editor - Nano-Banana by Google",
    description: "Transform images with Google's Nano-Banana AI model. Free online image editing with natural language prompts. No signup required.",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Nano-Banana AI Image Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Image Editor - Nano-Banana by Google",
    description: "Transform images with Google's Nano-Banana AI model. Free online image editing with natural language prompts. No signup required.",
    images: ["/preview.png"],
  },
  alternates: {
    canonical: "https://nanobanana.food"
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  viewportFit: "cover",
  themeColor: "#e04f0c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Nano-Banana AI Image Editor",
    "alternateName": "Nano-Banana",
    "description": "Free AI image editor using Google's Nano-Banana model. Transform, edit, and enhance images with natural language prompts. No signup required.",
    "url": "https://nanobanana.food",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires HTML5 support",
    "softwareVersion": "1.0",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization", 
      "name": "Nano-Banana Community"
    },
    "keywords": "AI image editor, Nano-Banana, Google image AI, free image editing, AI photo editor, image generation, natural language editing",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127"
    },
    "featureList": [
      "AI-powered image editing",
      "Natural language prompts",
      "Google Nano-Banana model",
      "Free to use",
      "No signup required",
      "Multiple AI providers (Replicate, FAL)"
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#e04f0c" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nano-Banana Community" />
        <link rel="canonical" href="https://nanobanana.food" />
        <link rel="manifest" href="/manifest.json" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen w-full flex justify-center m-0 p-0" 
            style={{ 
              backgroundImage: "url('/banana-pattern.png')", 
              backgroundSize: "400px 400px", 
              backgroundRepeat: "repeat" 
            }}>
        <AppProvider>
          {children}
        </AppProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}