import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatScroll } from '../../hooks/useChatScroll';
import type { Message } from '../../types';

describe('useChatScroll', () => {
  const mockScrollIntoView = vi.fn();
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Element.prototype.scrollIntoView = mockScrollIntoView;
    Element.prototype.addEventListener = mockAddEventListener;
    Element.prototype.removeEventListener = mockRemoveEventListener;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('scrolls to bottom on new user message', () => {
    const messages: Message[] = [{ id: '1', role: 'user', content: 'test' }];
    
    const { result } = renderHook(() => useChatScroll({ messages, isTyping: false }));

    // Mock the refs
    Object.defineProperty(result.current.messagesEndRef, 'current', {
      value: document.createElement('div'),
      writable: true
    });

    Object.defineProperty(result.current.scrollContainerRef, 'current', {
      value: document.createElement('div'),
      writable: true
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ 
      behavior: 'smooth', 
      block: 'end' 
    });
  });

  test('handles content updates', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    // Mock the refs
    Object.defineProperty(result.current.messagesEndRef, 'current', {
      value: document.createElement('div'),
      writable: true
    });

    Object.defineProperty(result.current.scrollContainerRef, 'current', {
      value: document.createElement('div'),
      writable: true
    });

    act(() => {
      result.current.handleContentUpdate();
      vi.runAllTimers();
    });

    expect(mockScrollIntoView).toHaveBeenCalled();
  });
});