import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "AI Image Editor - Transform images with AI, powered by Nano-Banana on Replicate",
  description: "AI Image Editor is a tool for image editing powered by Nano-Banana, an image model from Google, running on Replicate. The app is built with Hono and React, running on Cloudflare Workers. Learn how to build your own app by taking a look at the source code on GitHub.",
  openGraph: {
    type: "website",
    url: "https://kontext-chat.replicate.dev/",
    title: "AI Image Editor - Transform images with AI",
    description: "AI Image Editor is a tool for image editing powered by Nano-Banana, an image model from Google, running on Replicate. The app is built with Hono and React, running on Cloudflare Workers. Learn how to build your own app by taking a look at the source code on GitHub.",
    images: [
      {
        url: "https://kontext-chat.replicate.dev/kontext-chat.jpg",
        width: 1200,
        height: 630,
        alt: "AI Image Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Editor - Transform images with AI",
    description: "AI Image Editor is a tool for image editing powered by Nano-Banana, an image model from Google, running on Replicate. The app is built with Hono and React, running on Cloudflare Workers. Learn how to build your own app by taking a look at the source code on GitHub.",
    images: ["https://kontext-chat.replicate.dev/kontext-chat.jpg"],
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
  return (
    <html lang="en">
      <body className="min-h-screen w-full flex justify-center m-0 p-0" 
            style={{ 
              backgroundImage: "url('/banana-pattern.png')", 
              backgroundSize: "400px 400px", 
              backgroundRepeat: "repeat" 
            }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}