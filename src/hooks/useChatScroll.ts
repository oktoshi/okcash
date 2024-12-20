import { useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';

interface UseChatScrollProps {
  messages: Array<unknown>;
  isTyping: boolean;
}

export function useChatScroll({ messages }: UseChatScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  // Check if scroll is near bottom
  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const threshold = 100; // pixels from bottom
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = position < threshold;
  }, []);

  // Debounced scroll handler
  const handleScroll = useCallback(
    debounce(() => checkIfNearBottom(), 100),
    [checkIfNearBottom]
  );

  // Progressive scroll that follows typing
  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    if (scrollContainerRef.current && messagesEndRef.current && isNearBottomRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior,
        block: 'end',
      });
    }
  }, []);

  // Handle content updates during typing
  const handleContentUpdate = useCallback(() => {
    if (isNearBottomRef.current) {
      scrollToBottom('auto');
    }
  }, [scrollToBottom]);

  // Setup scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Handle new messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && 'role' in lastMessage && lastMessage.role === 'user') {
        // Always scroll to bottom for user messages
        isNearBottomRef.current = true;
        scrollToBottom('auto');
      }
    }
  }, [messages, scrollToBottom]);

  return {
    scrollContainerRef,
    messagesEndRef,
    handleContentUpdate,
    scrollToBottom
  };
}