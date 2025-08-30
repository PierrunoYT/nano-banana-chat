import React from 'react';
import { ChatInterfaceProps } from '@/lib/types';
import { Button } from '@/components/ui/button';
import PoweredByBanner from '@/components/PoweredByBanner';

export default function ChatInterface({
  messages,
  input,
  loading,
  onInputChange,
  onSendMessage,
  onCancelGeneration,
  onDeleteFromMessage,
  onImageClick,
  onDownloadImage,
  onResetApp,
  hasApiToken,
  onOpenSettings
}: ChatInterfaceProps) {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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

  // Focus textarea when component mounts
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, []);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full md:max-w-4xl md:mx-auto bg-yellow-100/95 backdrop-blur-sm md:shadow-lg overflow-hidden flex flex-col min-h-screen md:h-full relative">
      {/* Chat Header with Logo */}
      <div className="p-4 md:p-2 border-b border-yellow-300 relative flex items-center flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onResetApp}
          className="absolute left-4 w-8 h-8 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-all duration-200 hover:scale-105"
          title="Back to upload"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          className="absolute right-4 w-8 h-8 bg-yellow-200 hover:bg-yellow-300 text-gray-700 rounded-full transition-all duration-200 hover:scale-105"
          title="API Settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </Button>
        <img 
          src="/nanobanana.png" 
          className="w-1/3 md:w-1/4 mx-auto cursor-pointer hover:opacity-90 transition-opacity" 
          alt="Nano-Banana"
          style={{mixBlendMode: 'multiply'}} 
          onClick={onResetApp}
          title="Back to upload"
        />
      </div>
      <PoweredByBanner />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32 md:pb-6" ref={chatContainerRef}>
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
                    onClick={() => msg.image && onImageClick(msg.image)}
                    onLoad={scrollToBottom}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => msg.image && onDownloadImage(msg.image)}
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
                  onClick={() => onDeleteFromMessage(msg.id)}
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
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-100/90 backdrop-blur-sm border-t border-yellow-300 p-4 md:relative md:border-t md:bg-yellow-100 md:backdrop-blur-none" style={{paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 1rem))'}}>
        <form onSubmit={onSendMessage} className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <div className="bg-yellow-50 rounded-3xl px-4 py-3 pr-12 border-2 border-yellow-300 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-200 transition-all duration-200 shadow-sm">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={hasApiToken ? "Describe how you'd like to edit this image..." : "Configure your API token in Settings first"}
                className="w-full bg-transparent border-none outline-none resize-none text-base"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '120px' }}
                disabled={loading || !hasApiToken}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && input.trim() && hasApiToken) {
                      onSendMessage(e);
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
                  onClick={onCancelGeneration}
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
                  disabled={!input.trim() || loading || !hasApiToken}
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
  );
}