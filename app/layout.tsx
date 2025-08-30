import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";

export const metadata: Metadata = {
  title: "Nano-Banana AI Image Editor - Transform Images with AI",
  description: "Transform your images with AI using Nano-Banana, Google's powerful image editing model. Choose between Replicate or FAL as your AI provider. Upload an image and describe how you'd like to edit it using natural language.",
  openGraph: {
    type: "website",
    url: "https://nano-banana-chat.vercel.app/",
    title: "Nano-Banana AI Image Editor",
    description: "Transform your images with AI using Nano-Banana, Google's powerful image editing model. Upload an image and describe how you'd like to edit it using natural language.",
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
    title: "Nano-Banana AI Image Editor",
    description: "Transform your images with AI using Nano-Banana, Google's powerful image editing model. Upload an image and describe how you'd like to edit it using natural language.",
    images: ["/preview.png"],
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