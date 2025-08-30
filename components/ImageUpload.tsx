import React from 'react';
import { ImageUploadProps, StarterImage } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { SecurityFeatures } from './SecurityFeatures';
import PoweredByBanner from '@/components/PoweredByBanner';

const starterImages: StarterImage[] = [
  {
    imageUrl: 'https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png',
    suggestedPrompt: 'make it into a 90s cartoon',
  },
  {
    imageUrl: 'https://replicate.delivery/pbxt/N5cepICxyaagdvULl0phi7ImdxuFz05TR2l623zqxhNR9q5Y/van-gogh.jpeg',
    suggestedPrompt: 'Using this style, a panda astronaut riding a unicorn',
  },
  {
    imageUrl: 'https://replicate.delivery/xezq/OKWfR6jlQwzekkSsfQOppX55O3vaNv6xZ4qY6RfHjwQHOwDTB/tmp9p3v3brc.png',
    suggestedPrompt: 'remove the text from the sweatshirt',
  },
  {
    imageUrl: 'https://replicate.delivery/pbxt/N5trWTJCJQbJVWz5nhLEscS1w16r1hGl5zuWceJhVSnWZfGu/mona-lisa-1024.jpg',
    suggestedPrompt: 'close her eyes',
  },
  {
    imageUrl: 'https://replicate.delivery/mgxm/b033ff07-1d2e-4768-a137-6c16b5ed4bed/d_1.png',
    suggestedPrompt: 'Convert to a high-quality restoration, enhancing details and removing any damage or degradation',
  }
];

export default function ImageUpload({
  onFileUpload,
  onStarterImageClick,
  dragActive,
  onDragStateChange,
  loading
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
      <PoweredByBanner />

      {/* Upload Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto pb-24 md:pb-12">
        {/* Intro Text */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            Transform Images with AI
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Upload an image and describe how you'd like to edit it using natural language.
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center cursor-pointer mb-12 transition-all duration-300 ${
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

        {/* Starter Images Section */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Try These Examples</h2>
          <p className="text-gray-600 text-base">Click any image to start editing</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {starterImages.map((starter, idx) => (
            <Button
              key={idx}
              variant="ghost"
              className="aspect-square w-full rounded-2xl overflow-hidden border-2 border-yellow-200 hover:border-yellow-400 focus:border-yellow-500 transition-all duration-300 shadow-md hover:shadow-xl bg-yellow-50 group hover:scale-105 p-0"
              onClick={() => onStarterImageClick(starter)}
              disabled={loading}
              title={starter.suggestedPrompt}
            >
              <img
                src={starter.imageUrl}
                alt={starter.suggestedPrompt}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              />
            </Button>
          ))}
        </div>

        {/* Footer Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-base md:text-lg leading-relaxed text-center">
            Transform your images with AI using <a href="https://replicate.com/google/nano-banana" className="underline text-yellow-600 hover:text-yellow-700">Nano-Banana</a>, Google's powerful image editing model. Choose between <a href="https://replicate.com" className="underline text-yellow-600 hover:text-yellow-700">Replicate</a> or <a href="https://fal.ai" className="underline text-yellow-600 hover:text-yellow-700">FAL.ai</a> as your AI provider. Built with <a href="https://nextjs.org" className="underline text-yellow-600 hover:text-yellow-700">Next.js</a> and <a href="https://tailwindcss.com" className="underline text-yellow-600 hover:text-yellow-700">Tailwind CSS</a> for a smooth editing experience. Check out the <a href="https://github.com/PierrunoYT/nano-banana-chat" className="underline text-yellow-600 hover:text-yellow-700">source code</a> on GitHub to build your own AI image editor.
          </p>
          <div className="mt-24 mb-8 flex justify-center">
            <p className="text-gray-500 text-5xl font-bold">Made with 🍌</p>
          </div>
          
          {/* Security Features */}
          <SecurityFeatures />
        </div>
      </div>
    </div>
  );
}