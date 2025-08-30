import React from 'react';
import { ImageUploadProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SecurityFeatures } from './SecurityFeatures';
import PoweredByBanner from '@/components/PoweredByBanner';

export default function ImageUpload({
  onFileUpload,
  onStarterImageClick,
  dragActive,
  onDragStateChange,
  loading,
  onOpenSettings
}: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Drag and drop handlers
  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      onDragStateChange(true);
    } else if (e.type === 'dragleave') {
      onDragStateChange(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    onDragStateChange(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      onFileUpload(files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  }

  return (
    <div className="w-full md:max-w-4xl md:mx-auto bg-yellow-100/95 backdrop-blur-sm md:shadow-lg flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="p-4 md:p-2 border-b border-yellow-300 relative">
        <img src="/nanobanana.png" className="w-1/3 md:w-1/4 mx-auto" alt="Nano-Banana" style={{mixBlendMode: 'multiply'}} />
      </div>
      <PoweredByBanner onOpenSettings={onOpenSettings} />

      {/* Upload Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto pb-24 md:pb-12">
        {/* Intro Text */}
        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Transform Images with AI
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Upload an image and describe how you'd like to edit it using natural language.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-3xl p-6 md:p-8 text-center cursor-pointer mb-6 transition-all duration-300 ${
            dragActive
              ? 'border-yellow-400 bg-yellow-200/90 text-yellow-800 scale-105 shadow-lg'
              : 'border-yellow-300 bg-yellow-100/80 hover:border-yellow-400 hover:bg-yellow-200/90 text-gray-700 hover:text-yellow-800 hover:shadow-lg hover:scale-105'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <h3 className="text-xl md:text-2xl mb-2 font-bold">Upload Your Image</h3>
            <p className="text-base md:text-lg opacity-90 mb-2">Drag and drop an image here, or click to browse</p>
            <p className="text-sm text-gray-500">Supports JPG, PNG, GIF • Max 10MB</p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <SecurityFeatures />
          
          {/* Footer Text */}
          <div className="mt-4">
            <p className="text-gray-600 text-sm leading-relaxed text-center">
              Transform your images with AI using <a href="https://replicate.com/google/nano-banana" className="underline text-yellow-600 hover:text-yellow-700">Nano-Banana</a>, Google's powerful image editing model. Choose between <a href="https://replicate.com" className="underline text-yellow-600 hover:text-yellow-700">Replicate</a> or <a href="https://fal.ai" className="underline text-yellow-600 hover:text-yellow-700">FAL</a> as your AI provider. Built with <a href="https://nextjs.org" className="underline text-yellow-600 hover:text-yellow-700">Next.js</a> and <a href="https://tailwindcss.com" className="underline text-yellow-600 hover:text-yellow-700">Tailwind CSS</a> for a smooth editing experience. Check out the <a href="https://github.com/PierrunoYT/nano-banana-chat" className="underline text-yellow-600 hover:text-yellow-700">source code</a> on GitHub to build your own AI image editor.
            </p>
            <p className="text-gray-500 text-xs text-center mt-3">
              This site uses analytics to improve user experience. No personal data is stored.
            </p>
          </div>
          
          {/* Made with Banana */}
          <div className="mt-3 mb-2 flex justify-center">
            <p className="text-gray-500 text-3xl font-bold">Made with 🍌</p>
          </div>
          
          {/* Banana Animation */}
          <div className="flex justify-center mb-4">
            <img 
              src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdzF5c2QyNHR0czA2Y3p5amhyOHc0djhodGpkYzAxZ2V3YnR0aTd0YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bh4jzePjmd9iE/giphy.gif" 
              alt="Dancing banana" 
              className="w-full h-64 md:h-80 object-contain max-w-md mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}