import { createContext, useContext, useRef, useCallback } from 'react';

interface ChatFocusContextType {
  inputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void;
}

export const ChatFocusContext = createContext<ChatFocusContextType | null>(null);

export function useChatFocusProvider() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return {
    inputRef,
    focusInput,
  };
}

export function useChatFocus() {
  const context = useContext(ChatFocusContext);
  if (!context) {
    throw new Error('useChatFocus must be used within a ChatFocusProvider');
  }
  return context;
}