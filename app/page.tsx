'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const starterImages = [
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

function PoweredByBanner() {
  return (
    <div className="bg-yellow-500 text-white text-center text-base md:text-lg py-2">
      <a
        href="https://replicate.com/google/nano-banana?utm_source=project&utm_campaign=kontext-chat"
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        Powered by Nano-Banana on Replicate
      </a>
    </div>
  );
}

interface Message {
  type: 'image' | 'text' | 'loading';
  text?: string;
  image?: string;
  imageBlob?: Blob;
  from: 'user' | 'assistant' | 'system';
  id: number;
  showDelete?: boolean;
}

export default function App() {
  // State for upload vs chat mode
  const [showUpload, setShowUpload] = React.useState(true);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [abortController, setAbortController] = React.useState<AbortController | null>(null);
  const [starterUsed, setStarterUsed] = React.useState(false);
  
  // API provider state
  const [apiProvider, setApiProvider] = React.useState<'replicate' | 'fal'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('apiProvider') as 'replicate' | 'fal') || 'replicate';
    }
    return 'replicate';
  });
  
  // API token states
  const [replicateToken, setReplicateToken] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('replicateApiToken') || '';
    }
    return '';
  });
  
  const [falToken, setFalToken] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('falApiToken') || '';
    }
    return '';
  });
  
  const currentToken = apiProvider === 'replicate' ? replicateToken : falToken;
  const [showTokenModal, setShowTokenModal] = React.useState(!currentToken);
  const [tokenInput, setTokenInput] = React.useState('');
  const [tokenError, setTokenError] = React.useState('');

  // Simple desktop check
  const [isDesktop, setIsDesktop] = React.useState(false);
  React.useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Refs
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Focus textarea when switching to chat mode
  React.useEffect(() => {
    if (!showUpload && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [showUpload]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }, [messages]);

  // Lock body scrolling on mobile
  React.useEffect(() => {
    if (!isDesktop) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isDesktop]);

  // Drag and drop state
  const [dragActive, setDragActive] = React.useState(false);

  // Helper to scroll to bottom
  function scrollToBottom() {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  }

  // Drag and drop handlers
  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      handleFile(files[0]);
    }
  }

  // Handle file selection
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  // Process uploaded file
  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image file is too large. Please select an image under 10MB.');
      return;
    }

    try {
      // Scale down the image to 1 megapixel
      const scaledBlob = await scaleImageTo1Megapixel(file);
      const url = URL.createObjectURL(scaledBlob);

      // Add initial messages
      setMessages([
        { type: 'image', image: url, imageBlob: scaledBlob, from: 'assistant', id: Date.now() },
        { type: 'text', text: 'Image uploaded! How would you like to edit it?', from: 'system', id: Date.now() + 1 }
      ]);

      // Switch to chat mode
      setShowUpload(false);
    } catch (error: any) {
      alert('Failed to process image: ' + error.message);
    }
  }

  // Handle starter image click
  async function handleStarterImageClick(starter: typeof starterImages[0]) {
    try {
      setLoading(true);
      const res = await fetch(starter.imageUrl);
      const blob = await res.blob();
      setMessages([
        { type: 'image', image: starter.imageUrl, imageBlob: blob, from: 'assistant', id: Date.now() },
        { type: 'text', text: "Image loaded! Tell me how you'd like to edit it.", from: 'system', id: Date.now() + 1 }
      ]);
      setShowUpload(false);
      setInput(starter.suggestedPrompt || '');
      setStarterUsed(true);
    } catch (err) {
      alert('Failed to load starter image.');
    } finally {
      setLoading(false);
    }
  }

  // Helper function to convert blob to data URL
  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Get the most recent image from the chat
  function getLastImageBlob() {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'image' && messages[i].imageBlob) {
        return messages[i].imageBlob;
      }
    }
    return null;
  }

  // Scale image function
  async function scaleImageTo1Megapixel(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        const originalWidth = img.width;
        const originalHeight = img.height;
        const originalPixels = originalWidth * originalHeight;
        const targetPixels = 1000000;

        let newWidth, newHeight;

        if (originalPixels <= targetPixels) {
          newWidth = originalWidth;
          newHeight = originalHeight;
        } else {
          const scaleFactor = Math.sqrt(targetPixels / originalPixels);
          newWidth = Math.round(originalWidth * scaleFactor);
          newHeight = Math.round(originalHeight * scaleFactor);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create scaled image'));
          }
        }, 'image/jpeg', 0.9);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // Reset to upload mode
  function resetApp() {
    if (abortController) {
      abortController.abort();
    }
    setShowUpload(true);
    setMessages([]);
    setInput('');
    setAbortController(null);
    setLoading(false);
    setStarterUsed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // Handle sending a message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const lastImageBlob = getLastImageBlob();
    if (!input.trim() || loading || !lastImageBlob || !currentToken) return;

    const userMsg: Message = { type: 'text', text: input, from: 'user', id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Add loading message
    const loadingMsg: Message = { type: 'loading', from: 'assistant', id: Date.now() + 1 };
    setMessages(prev => [...prev, loadingMsg]);

    try {
      // Create abort controller for this request
      const controller = new AbortController();
      setAbortController(controller);

      // Convert blob to data URL for the API
      const imageDataUrl = await blobToDataUrl(lastImageBlob);

      const requestBody = {
        prompt: input,
        input_image: imageDataUrl
      };

      const apiEndpoint = apiProvider === 'replicate' ? '/api/generate-image' : '/api/generate-image-fal';
      const tokenHeader = apiProvider === 'replicate' ? 'X-Replicate-Api-Token' : 'X-Fal-Api-Token';
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          [tokenHeader]: currentToken 
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const result = await res.json();

      if (result.error) {
        throw new Error(result.error);
      }

      const imageUrl = result.imageUrl;

      // Fetch the image to create a blob
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Replace loading with image
      setMessages(prev => prev.map(msg =>
        msg.type === 'loading' ?
          { type: 'image', image: imageUrl, imageBlob: imageBlob, from: 'assistant', id: msg.id } :
          msg
      ));

      // Add delete button to user message
      setMessages(prev => prev.map(msg =>
        msg.id === userMsg.id ? { ...msg, showDelete: true } : msg
      ));

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages(prev => prev.filter(msg => msg.type !== 'loading'));
        setMessages(prev => [...prev, {
          type: 'text',
          text: 'Sorry, there was an error generating the image: ' + err.message,
          from: 'assistant',
          id: Date.now()
        }]);
      } else {
        setMessages(prev => prev.filter(msg => msg.type !== 'loading'));
      }
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  // Cancel generation
  function cancelGeneration() {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }

    setLoading(false);

    // Find the most recent user message to restore to input
    const currentMessages = [...messages];
    const lastUserMessage = currentMessages.slice().reverse().find(msg => msg.from === 'user' && msg.type === 'text');

    // Remove loading message and the most recent user message
    setMessages(prev => {
      const filtered = prev.filter(msg =>
        msg.type !== 'loading' &&
        !(lastUserMessage && msg.from === 'user' && msg.type === 'text' && msg.id === lastUserMessage.id)
      );
      return filtered;
    });

    // Restore the cancelled message to input
    if (lastUserMessage) {
      setTimeout(() => {
        setInput(lastUserMessage.text || '');
      }, 50);
    }
  }

  // Delete message and all subsequent messages
  function deleteFromMessage(messageId: number) {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const remainingMessages = messages.slice(0, messageIndex);
    setMessages(remainingMessages);
  }

  // Handle image click for full screen
  function handleImageClick(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  // Download image function
  async function downloadImage(imageUrl: string) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `nano-banana-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      window.open(imageUrl, '_blank');
    }
  }

  // Attach drag events when in upload mode
  React.useEffect(() => {
    if (showUpload) {
      const handleDragEvents = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
          setDragActive(true);
        } else if (e.type === 'dragleave') {
          setDragActive(false);
        } else if (e.type === 'drop') {
          setDragActive(false);
          const files = e.dataTransfer?.files;
          if (files && files[0] && files[0].type.startsWith('image/')) {
            handleFile(files[0]);
          }
        }
      };

      window.addEventListener('dragenter', handleDragEvents);
      window.addEventListener('dragover', handleDragEvents);
      window.addEventListener('dragleave', handleDragEvents);
      window.addEventListener('drop', handleDragEvents);
      
      return () => {
        window.removeEventListener('dragenter', handleDragEvents);
        window.removeEventListener('dragover', handleDragEvents);
        window.removeEventListener('dragleave', handleDragEvents);
        window.removeEventListener('drop', handleDragEvents);
      };
    }
  }, [showUpload]);

  React.useEffect(() => {
    if (!currentToken) {
      setShowTokenModal(true);
    } else {
      setShowTokenModal(false);
    }
  }, [currentToken, apiProvider]);

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setTokenError(`Please enter your ${apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API token.`);
      return;
    }
    
    if (apiProvider === 'replicate') {
      localStorage.setItem('replicateApiToken', tokenInput.trim());
      setReplicateToken(tokenInput.trim());
    } else {
      localStorage.setItem('falApiToken', tokenInput.trim());
      setFalToken(tokenInput.trim());
    }
    
    setShowTokenModal(false);
    setTokenInput('');
    setTokenError('');
  }

  function handleTokenLogout() {
    if (apiProvider === 'replicate') {
      localStorage.removeItem('replicateApiToken');
      setReplicateToken('');
    } else {
      localStorage.removeItem('falApiToken');
      setFalToken('');
    }
    setShowTokenModal(true);
  }

  function handleProviderChange(provider: 'replicate' | 'fal') {
    setApiProvider(provider);
    localStorage.setItem('apiProvider', provider);
    const token = provider === 'replicate' ? replicateToken : falToken;
    if (!token) {
      setShowTokenModal(true);
    }
  }

  return (
    <div className="h-full w-full overflow-hidden">
      {/* API Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-yellow-100 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <img src="/nanobanana.png" className="w-1/3 mx-auto mb-4" alt="Nano-Banana" style={{mixBlendMode: 'multiply'}} />
            
            {/* Provider Selection */}
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={apiProvider === 'replicate' ? 'default' : 'outline'}
                onClick={() => handleProviderChange('replicate')}
                className="px-4 py-2"
              >
                Replicate
              </Button>
              <Button
                type="button"
                variant={apiProvider === 'fal' ? 'default' : 'outline'}
                onClick={() => handleProviderChange('fal')}
                className="px-4 py-2"
              >
                FAL.ai
              </Button>
            </div>
            
            <h2 className="text-xl font-bold mb-2 text-center">
              Enter your {apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API Token
            </h2>
            <p className="text-gray-700 text-center mb-4">
              To use AI Image Editor, you'll need a {apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API token.<br />
              <a 
                href={apiProvider === 'replicate' 
                  ? "https://replicate.com/account/api-tokens?new-token-name=ai-image-editor" 
                  : "https://fal.ai/dashboard/keys"
                } 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline text-yellow-600"
              >
                Create a token here
              </a> and paste it below.
            </p>
            <form onSubmit={handleTokenSubmit} className="w-full flex flex-col items-center">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 text-base"
                placeholder={`Paste your ${apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API token`}
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                autoFocus
              />
              {tokenError && <div className="text-red-600 text-sm mb-2">{tokenError}</div>}
              <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white">
                Save Token
              </Button>
            </form>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="h-full w-full flex flex-col">
        {showUpload ? (
          /* Upload Section */
          <div className="w-full md:max-w-4xl md:mx-auto bg-yellow-100/95 backdrop-blur-sm md:shadow-lg flex flex-col h-full overflow-hidden">
            {/* Logo */}
            <div className="p-4 md:p-2 border-b border-yellow-300">
              <img src="/nanobanana.png" className="w-1/3 md:w-1/4 mx-auto" alt="Nano-Banana" style={{mixBlendMode: 'multiply'}} />
            </div>
            <PoweredByBanner />

            {/* Upload Area */}
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto md:overflow-visible pb-32 md:pb-6" style={{paddingBottom: 'calc(8rem + env(safe-area-inset-bottom))'}}>
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
                    onClick={() => handleStarterImageClick(starter)}
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
                  AI Image Editor is powered by <a href="https://replicate.com/google/nano-banana?utm_source=project&utm_campaign=kontext-chat" className="underline text-yellow-600 hover:text-yellow-700">Nano-Banana</a>, an image model from <a href="https://google.com/" className="underline text-yellow-600 hover:text-yellow-700">Google</a>, running on <a href="https://replicate.com?utm_source=project&utm_campaign=kontext-chat" className="underline text-yellow-600 hover:text-yellow-700">Replicate</a>. The app is built with Hono and React, running on <a href="https://workers.dev/" className="underline text-yellow-600 hover:text-yellow-700">Cloudflare Workers</a>. Learn how to build your own app by taking a look at the <a href="https://github.com/replicate/kontext-chat" className="underline text-yellow-600 hover:text-yellow-700">source code</a> on GitHub.
                </p>
                <div className="mt-24 mb-16 flex justify-center">
                  <p className="text-gray-500 text-5xl font-bold">Made with 🍌</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Chat Section */
          <div className="w-full md:max-w-4xl md:mx-auto bg-yellow-100/95 backdrop-blur-sm md:shadow-lg overflow-hidden flex flex-col h-full relative">
            {/* Chat Header with Logo */}
            <div className="p-4 md:p-2 border-b border-yellow-300 relative flex items-center flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={resetApp}
                className="absolute left-4 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-200 hover:scale-105"
                title="Back to upload"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
              </Button>
              <img 
                src="/nanobanana.png" 
                className="w-1/3 md:w-1/4 mx-auto cursor-pointer hover:opacity-90 transition-opacity" 
                alt="Nano-Banana"
                style={{mixBlendMode: 'multiply'}} 
                onClick={resetApp}
                title="Back to upload"
              />
              <div className="absolute right-4 flex items-center gap-2">
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  {apiProvider === 'replicate' ? 'Replicate' : 'FAL.ai'}
                </span>
                {currentToken && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleTokenLogout}
                    className="w-8 h-8 bg-gray-200 hover:bg-red-500 text-gray-700 hover:text-white rounded-full transition-all duration-200"
                    title={`Remove ${apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API Token`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </Button>
                )}
              </div>
            </div>
            <PoweredByBanner />

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-56 md:pb-6" ref={chatContainerRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`relative max-w-sm md:max-w-md ${
                      msg.from === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-3xl px-4 py-3'
                        : msg.from === 'system'
                        ? 'bg-blue-50 text-blue-800 rounded-2xl px-4 py-3 italic'
                        : 'bg-yellow-50 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3'
                    }`}
                  >
                    {msg.type === 'image' && (
                      <div className="relative inline-block">
                        <img
                          src={msg.image}
                          alt="Generated image"
                          className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => msg.image && handleImageClick(msg.image)}
                          onLoad={scrollToBottom}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => msg.image && downloadImage(msg.image)}
                          className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                          title="Download image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                        </Button>
                      </div>
                    )}
                    {msg.type === 'loading' && (
                      <div className="flex flex-col items-center gap-4 py-8 px-12">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-gray-200 border-t-yellow-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-yellow-300 rounded-full animate-spin" style={{animationDelay: '0.2s', animationDuration: '1.5s'}}></div>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-700 font-medium">Generating image...</span>
                          <p className="text-gray-500 text-sm mt-1">This may take a few moments</p>
                        </div>
                      </div>
                    )}
                    {msg.text && <div className="text-base md:text-lg">{msg.text}</div>}

                    {msg.showDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFromMessage(msg.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 hover:scale-110"
                        title="Delete from here and continue editing"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-yellow-100/90 backdrop-blur-sm border-t border-yellow-300 p-4 md:relative md:border-t md:bg-yellow-100 md:backdrop-blur-none" style={{paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'}}>
              <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
                <div className="flex-1 relative">
                  <div className="bg-yellow-50 rounded-3xl px-4 py-3 pr-12 border-2 border-yellow-300 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-200 transition-all duration-200 shadow-sm">
                    <textarea
                      ref={textareaRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Describe how you'd like to edit this image..."
                      className="w-full bg-transparent border-none outline-none resize-none text-base"
                      rows={1}
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!loading && input.trim()) {
                            handleSend(e);
                          }
                        }
                      }}
                    />

                    {/* Send/Cancel Button */}
                    {loading ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={cancelGeneration}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-full shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                        </svg>
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}