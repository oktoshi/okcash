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

  const checkIfNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const threshold = 100;
    const position = container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = position < threshold;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    requestAnimationFrame(() => {
      if (scrollContainerRef.current && messagesEndRef.current && isNearBottomRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
    });
  }, []);

  const handleScroll = useCallback(() => {
    checkIfNearBottom();
  }, [checkIfNearBottom]);

  const debouncedScroll = debounce(handleScroll, 100);

  const handleContentUpdate = useCallback(() => {
    if (isNearBottomRef.current) {
      scrollToBottom('auto');
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', debouncedScroll);
      return () => container.removeEventListener('scroll', debouncedScroll);
    }
  }, [debouncedScroll]);

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
    handleContentUpdate
  };
}