// API Provider Types
export type ApiProvider = 'replicate' | 'fal';

// Message Types
export interface Message {
  type: 'image' | 'text' | 'loading';
  text?: string;
  image?: string;
  imageBlob?: Blob;
  from: 'user' | 'assistant' | 'system';
  id: number;
  showDelete?: boolean;
}

// Starter Image Types
export interface StarterImage {
  imageUrl: string;
  suggestedPrompt: string;
}

// API Configuration
export interface ApiConfig {
  provider: ApiProvider;
  replicateToken: string;
  falToken: string;
}

// App State
export interface AppState {
  // UI State
  showUpload: boolean;
  showSettings: boolean;
  loading: boolean;
  dragActive: boolean;
  isDesktop: boolean;
  
  // Chat State
  messages: Message[];
  input: string;
  abortController: AbortController | null;
  starterUsed: boolean;
  
  // API State
  apiProvider: ApiProvider;
  replicateToken: string;
  falToken: string;
  tokenInput: string;
  tokenError: string;
}

// Component Props
export interface ImageUploadProps {
  onFileUpload: (file: File) => void;
  onStarterImageClick: (starter: StarterImage) => void;
  dragActive: boolean;
  onDragStateChange: (active: boolean) => void;
  loading: boolean;
}

export interface ChatInterfaceProps {
  messages: Message[];
  input: string;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onCancelGeneration: () => void;
  onDeleteFromMessage: (messageId: number) => void;
  onImageClick: (imageUrl: string) => void;
  onDownloadImage: (imageUrl: string) => void;
  onResetApp: () => void;
  hasApiToken: boolean;
  onOpenSettings: () => void;
}

export interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apiProvider: ApiProvider;
  currentToken: string;
  tokenInput: string;
  tokenError: string;
  onProviderChange: (provider: ApiProvider) => void;
  onTokenInputChange: (value: string) => void;
  onTokenSubmit: (e: React.FormEvent) => void;
  onTokenLogout: () => void;
}

export interface SecurityFeaturesProps {
  className?: string;
}

// Utility Types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ImageProcessingResult {
  blob: Blob;
  url: string;
}

// API Response Types
export interface ReplicateResponse {
  imageUrl: string;
}

export interface FalResponse {
  imageUrl: string;
  description?: string;
}

// Error Types
export interface AppError {
  message: string;
  type: 'network' | 'api' | 'validation' | 'unknown';
  details?: any;
}