import { useEffect, useRef, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import type { Message } from '../types';

interface UseChatScrollProps {
  messages: Message[];
  isTyping: boolean;
}

export function useChatScroll({ messages, isTyping }: UseChatScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const scrollHandlerRef = useRef<() => void>();

  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const threshold = 100;
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = position < threshold;
  }, []);

  const handleScroll = useCallback(() => {
    checkIfNearBottom();
  }, [checkIfNearBottom]);

  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current && messagesEndRef.current && isNearBottomRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
    });
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    scrollHandlerRef.current = debounce(handleScroll, 100);
    container.addEventListener('scroll', scrollHandlerRef.current);
    
    return () => {
      if (scrollHandlerRef.current) {
        container.removeEventListener('scroll', scrollHandlerRef.current);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (messages.length > 0 || isTyping) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user' || isTyping) {
        isNearBottomRef.current = true;
        scrollToBottom('auto');
      }
    }
  }, [messages, isTyping, scrollToBottom]);

  return {
    scrollContainerRef,
    messagesEndRef,
    handleContentUpdate: useCallback(() => {
      if (isNearBottomRef.current) {
        scrollToBottom('auto');
      }
    }, [scrollToBottom])
  };
}