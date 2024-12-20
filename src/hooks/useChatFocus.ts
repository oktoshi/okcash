import { createContext, useContext, useRef } from 'react';

type ChatFocusContextType = {
  inputRef: React.RefObject<HTMLInputElement>;
  focusInput: () => void;
};

export const ChatFocusContext = createContext<ChatFocusContextType | null>(null);

export function useChatFocusProvider() {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

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