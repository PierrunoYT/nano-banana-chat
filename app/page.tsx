'use client';

import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { StarterImage, Message } from '@/lib/types';
import ImageUpload from '@/components/ImageUpload';
import ChatInterface from '@/components/ChatInterface';
import SettingsPanel from '@/components/SettingsPanel';
import { Button } from '@/components/ui/button';

export default function App() {
  const { state, dispatch, currentToken, hasApiToken } = useApp();

  // Helper functions
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

  function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  function getLastImageBlob(): Blob | null {
    for (let i = state.messages.length - 1; i >= 0; i--) {
      if (state.messages[i].type === 'image' && state.messages[i].imageBlob) {
        return state.messages[i].imageBlob!;
      }
    }
    return null;
  }

  // Event handlers
  async function handleFileUpload(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image file is too large. Please select an image under 10MB.');
      return;
    }

    try {
      const scaledBlob = await scaleImageTo1Megapixel(file);
      const url = URL.createObjectURL(scaledBlob);

      dispatch({
        type: 'SET_MESSAGES',
        payload: [
          { type: 'image', image: url, imageBlob: scaledBlob, from: 'assistant', id: Date.now() },
          { type: 'text', text: 'Image uploaded! How would you like to edit it?', from: 'system', id: Date.now() + 1 }
        ]
      });

      dispatch({ type: 'SET_SHOW_UPLOAD', payload: false });
    } catch (error: any) {
      alert('Failed to process image: ' + error.message);
    }
  }

  async function handleStarterImageClick(starter: StarterImage) {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await fetch(starter.imageUrl);
      const blob = await res.blob();
      
      dispatch({
        type: 'SET_MESSAGES',
        payload: [
          { type: 'image', image: starter.imageUrl, imageBlob: blob, from: 'assistant', id: Date.now() },
          { type: 'text', text: "Image loaded! Tell me how you'd like to edit it.", from: 'system', id: Date.now() + 1 }
        ]
      });
      
      dispatch({ type: 'SET_SHOW_UPLOAD', payload: false });
      dispatch({ type: 'SET_INPUT', payload: starter.suggestedPrompt });
      dispatch({ type: 'SET_STARTER_USED', payload: true });
    } catch (err) {
      alert('Failed to load starter image.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    const lastImageBlob = getLastImageBlob();
    if (!state.input.trim() || state.loading || !lastImageBlob) return;
    
    if (!currentToken) {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          type: 'text',
          text: 'Please configure your API token in Settings to use AI image generation.',
          from: 'assistant',
          id: Date.now()
        }
      });
      return;
    }

    const userMsg: Message = { type: 'text', text: state.input, from: 'user', id: Date.now() };
    const inputText = state.input; // Store input text before clearing
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'SET_INPUT', payload: '' });
    dispatch({ type: 'SET_LOADING', payload: true });

    const loadingMsg: Message = { type: 'loading', from: 'assistant', id: Date.now() + 1 };
    dispatch({ type: 'ADD_MESSAGE', payload: loadingMsg });

    try {
      const controller = new AbortController();
      dispatch({ type: 'SET_ABORT_CONTROLLER', payload: controller });

      const imageDataUrl = await blobToDataUrl(lastImageBlob);
      const apiEndpoint = state.apiProvider === 'replicate' ? '/api/generate-image' : '/api/generate-image-fal';
      const tokenHeader = state.apiProvider === 'replicate' ? 'X-Replicate-Api-Token' : 'X-Fal-Api-Token';
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          [tokenHeader]: currentToken 
        },
        body: JSON.stringify({
          prompt: inputText,
          input_image: imageDataUrl
        }),
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
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();

      // Replace loading with image
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: loadingMsg.id,
          updates: { type: 'image', image: imageUrl, imageBlob: imageBlob }
        }
      });

      // Add delete button to user message
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          id: userMsg.id,
          updates: { showDelete: true }
        }
      });

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        dispatch({
          type: 'SET_MESSAGES',
          payload: state.messages.filter(msg => msg.type !== 'loading')
        });
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            type: 'text',
            text: 'Sorry, there was an error generating the image: ' + err.message,
            from: 'assistant',
            id: Date.now()
          }
        });
      } else {
        dispatch({
          type: 'SET_MESSAGES',
          payload: state.messages.filter(msg => msg.type !== 'loading')
        });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
      dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
    }
  }

  function handleCancelGeneration() {
    if (state.abortController) {
      state.abortController.abort();
      dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
    }

    dispatch({ type: 'SET_LOADING', payload: false });

    const currentMessages = [...state.messages];
    const lastUserMessage = currentMessages.slice().reverse().find(msg => msg.from === 'user' && msg.type === 'text');

    dispatch({
      type: 'SET_MESSAGES',
      payload: state.messages.filter(msg =>
        msg.type !== 'loading' &&
        !(lastUserMessage && msg.from === 'user' && msg.type === 'text' && msg.id === lastUserMessage.id)
      )
    });

    if (lastUserMessage) {
      setTimeout(() => {
        dispatch({ type: 'SET_INPUT', payload: lastUserMessage.text || '' });
      }, 50);
    }
  }

  function handleDeleteFromMessage(messageId: number) {
    dispatch({ type: 'REMOVE_MESSAGES_FROM', payload: messageId });
  }

  function handleImageClick(imageUrl: string) {
    window.open(imageUrl, '_blank');
  }

  async function handleDownloadImage(imageUrl: string) {
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

  function handleResetApp() {
    dispatch({ type: 'RESET_APP' });
  }

  // Settings handlers
  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!state.tokenInput.trim()) {
      dispatch({
        type: 'SET_TOKEN_ERROR',
        payload: `Please enter your ${state.apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API token.`
      });
      return;
    }
    
    if (state.apiProvider === 'replicate') {
      localStorage.setItem('replicateApiToken', state.tokenInput.trim());
      dispatch({ type: 'SET_REPLICATE_TOKEN', payload: state.tokenInput.trim() });
    } else {
      localStorage.setItem('falApiToken', state.tokenInput.trim());
      dispatch({ type: 'SET_FAL_TOKEN', payload: state.tokenInput.trim() });
    }
    
    dispatch({ type: 'SET_SHOW_SETTINGS', payload: false });
    dispatch({ type: 'SET_TOKEN_INPUT', payload: '' });
    dispatch({ type: 'SET_TOKEN_ERROR', payload: '' });
  }

  function handleTokenLogout() {
    if (state.apiProvider === 'replicate') {
      localStorage.removeItem('replicateApiToken');
      dispatch({ type: 'SET_REPLICATE_TOKEN', payload: '' });
    } else {
      localStorage.removeItem('falApiToken');
      dispatch({ type: 'SET_FAL_TOKEN', payload: '' });
    }
  }

  function handleProviderChange(provider: 'replicate' | 'fal') {
    dispatch({ type: 'SET_API_PROVIDER', payload: provider });
    localStorage.setItem('apiProvider', provider);
    dispatch({ type: 'SET_TOKEN_ERROR', payload: '' });
  }

  function openSettings() {
    dispatch({ type: 'SET_SHOW_SETTINGS', payload: true });
    dispatch({ type: 'SET_TOKEN_INPUT', payload: '' });
    dispatch({ type: 'SET_TOKEN_ERROR', payload: '' });
  }

  // Set up drag and drop for upload mode
  React.useEffect(() => {
    if (state.showUpload) {
      const handleDragEvents = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
          dispatch({ type: 'SET_DRAG_ACTIVE', payload: true });
        } else if (e.type === 'dragleave') {
          dispatch({ type: 'SET_DRAG_ACTIVE', payload: false });
        } else if (e.type === 'drop') {
          dispatch({ type: 'SET_DRAG_ACTIVE', payload: false });
          const files = e.dataTransfer?.files;
          if (files && files[0] && files[0].type.startsWith('image/')) {
            handleFileUpload(files[0]);
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
  }, [state.showUpload]);

  return (
    <div className="min-h-screen w-full max-w-full">
      {/* Settings Panel */}
      <SettingsPanel
        isOpen={state.showSettings}
        onClose={() => dispatch({ type: 'SET_SHOW_SETTINGS', payload: false })}
        apiProvider={state.apiProvider}
        currentToken={currentToken}
        tokenInput={state.tokenInput}
        tokenError={state.tokenError}
        onProviderChange={handleProviderChange}
        onTokenInputChange={(value) => dispatch({ type: 'SET_TOKEN_INPUT', payload: value })}
        onTokenSubmit={handleTokenSubmit}
        onTokenLogout={handleTokenLogout}
      />
      
      {/* Main Content */}
      <div className="h-full w-full flex flex-col">
        {state.showUpload ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={openSettings}
              className="absolute right-4 top-4 z-10 w-10 h-10 bg-yellow-200 hover:bg-yellow-300 text-gray-700 rounded-full"
              title="API Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </Button>
            <ImageUpload
              onFileUpload={handleFileUpload}
              onStarterImageClick={handleStarterImageClick}
              dragActive={state.dragActive}
              onDragStateChange={(active) => dispatch({ type: 'SET_DRAG_ACTIVE', payload: active })}
              loading={state.loading}
            />
          </div>
        ) : (
          <ChatInterface
            messages={state.messages}
            input={state.input}
            loading={state.loading}
            onInputChange={(value) => dispatch({ type: 'SET_INPUT', payload: value })}
            onSendMessage={handleSendMessage}
            onCancelGeneration={handleCancelGeneration}
            onDeleteFromMessage={handleDeleteFromMessage}
            onImageClick={handleImageClick}
            onDownloadImage={handleDownloadImage}
            onResetApp={handleResetApp}
            hasApiToken={hasApiToken}
            onOpenSettings={openSettings}
          />
        )}
      </div>
    </div>
  );
}