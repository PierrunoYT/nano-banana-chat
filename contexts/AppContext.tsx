'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, ApiProvider, Message } from '@/lib/types';

// Initial state
const initialState: AppState = {
  // UI State
  showUpload: true,
  showSettings: false,
  loading: false,
  dragActive: false,
  isDesktop: false,
  
  // Chat State
  messages: [],
  input: '',
  abortController: null,
  starterUsed: false,
  
  // API State
  apiProvider: 'replicate',
  replicateToken: '',
  falToken: '',
  tokenInput: '',
  tokenError: '',
};

// Action types
type AppAction =
  | { type: 'SET_SHOW_UPLOAD'; payload: boolean }
  | { type: 'SET_SHOW_SETTINGS'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DRAG_ACTIVE'; payload: boolean }
  | { type: 'SET_IS_DESKTOP'; payload: boolean }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: { id: number; updates: Partial<Message> } }
  | { type: 'REMOVE_MESSAGES_FROM'; payload: number }
  | { type: 'SET_INPUT'; payload: string }
  | { type: 'SET_ABORT_CONTROLLER'; payload: AbortController | null }
  | { type: 'SET_STARTER_USED'; payload: boolean }
  | { type: 'SET_API_PROVIDER'; payload: ApiProvider }
  | { type: 'SET_REPLICATE_TOKEN'; payload: string }
  | { type: 'SET_FAL_TOKEN'; payload: string }
  | { type: 'SET_TOKEN_INPUT'; payload: string }
  | { type: 'SET_TOKEN_ERROR'; payload: string }
  | { type: 'RESET_APP' }
  | { type: 'HYDRATE_FROM_STORAGE'; payload: Partial<AppState> };

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_SHOW_UPLOAD':
      return { ...state, showUpload: action.payload };
    case 'SET_SHOW_SETTINGS':
      return { ...state, showSettings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_DRAG_ACTIVE':
      return { ...state, dragActive: action.payload };
    case 'SET_IS_DESKTOP':
      return { ...state, isDesktop: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        )
      };
    case 'REMOVE_MESSAGES_FROM':
      const messageIndex = state.messages.findIndex(msg => msg.id === action.payload);
      return {
        ...state,
        messages: messageIndex === -1 ? state.messages : state.messages.slice(0, messageIndex)
      };
    case 'SET_INPUT':
      return { ...state, input: action.payload };
    case 'SET_ABORT_CONTROLLER':
      return { ...state, abortController: action.payload };
    case 'SET_STARTER_USED':
      return { ...state, starterUsed: action.payload };
    case 'SET_API_PROVIDER':
      return { ...state, apiProvider: action.payload };
    case 'SET_REPLICATE_TOKEN':
      return { ...state, replicateToken: action.payload };
    case 'SET_FAL_TOKEN':
      return { ...state, falToken: action.payload };
    case 'SET_TOKEN_INPUT':
      return { ...state, tokenInput: action.payload };
    case 'SET_TOKEN_ERROR':
      return { ...state, tokenError: action.payload };
    case 'RESET_APP':
      if (state.abortController) {
        state.abortController.abort();
      }
      return {
        ...state,
        showUpload: true,
        messages: [],
        input: '',
        abortController: null,
        loading: false,
        starterUsed: false,
      };
    case 'HYDRATE_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Computed values
  currentToken: string;
  hasApiToken: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedApiProvider = localStorage.getItem('apiProvider') as ApiProvider || 'replicate';
    const savedReplicateToken = localStorage.getItem('replicateApiToken') || '';
    const savedFalToken = localStorage.getItem('falApiToken') || '';

    dispatch({
      type: 'HYDRATE_FROM_STORAGE',
      payload: {
        apiProvider: savedApiProvider,
        replicateToken: savedReplicateToken,
        falToken: savedFalToken,
      }
    });

    // Set up desktop detection
    const checkDesktop = () => dispatch({ type: 'SET_IS_DESKTOP', payload: window.innerWidth >= 768 });
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Computed values
  const currentToken = state.apiProvider === 'replicate' ? state.replicateToken : state.falToken;
  const hasApiToken = Boolean(currentToken);

  const value: AppContextType = {
    state,
    dispatch,
    currentToken,
    hasApiToken,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}