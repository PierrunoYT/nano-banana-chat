import { SettingsPanelProps } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function SettingsPanel({
  isOpen,
  onClose,
  apiProvider,
  currentToken,
  tokenInput,
  tokenError,
  onProviderChange,
  onTokenInputChange,
  onTokenSubmit,
  onTokenLogout
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="bg-yellow-100 rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-4">
          <h2 className="text-xl font-bold">API Settings</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </Button>
        </div>
        
        {/* Provider Selection */}
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            onClick={() => onProviderChange('replicate')}
            className={`px-4 py-2 ${
              apiProvider === 'replicate' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Replicate
          </Button>
          <Button
            type="button"
            onClick={() => onProviderChange('fal')}
            className={`px-4 py-2 ${
              apiProvider === 'fal' 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            FAL.ai
          </Button>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 text-center">
          {apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API Token
        </h3>
        <p className="text-gray-700 text-center mb-4 text-sm">
          <a 
            href={apiProvider === 'replicate' 
              ? "https://replicate.com/account/api-tokens?new-token-name=ai-image-editor" 
              : "https://fal.ai/dashboard/keys"
            } 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline text-yellow-600"
          >
            Get your API token here
          </a>
        </p>
        <form onSubmit={onTokenSubmit} className="w-full flex flex-col items-center">
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 text-base"
            placeholder={`${currentToken ? 'Update' : 'Enter'} your ${apiProvider === 'replicate' ? 'Replicate' : 'FAL'} API token`}
            value={tokenInput}
            onChange={e => onTokenInputChange(e.target.value)}
            autoFocus
          />
          {tokenError && <div className="text-red-600 text-sm mb-2">{tokenError}</div>}
          <div className="flex gap-2 w-full">
            <Button type="submit" className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white">
              Save Token
            </Button>
            {currentToken && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onTokenLogout}
                className="px-4 border-red-300 text-red-600 hover:bg-red-50"
              >
                Clear
              </Button>
            )}
          </div>
        </form>
        {currentToken && (
          <div className="text-green-600 text-sm mt-2 text-center">
            ✓ API token configured
          </div>
        )}
      </div>
    </div>
  );
}