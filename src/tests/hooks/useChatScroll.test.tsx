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

    // Mock DOM methods
    const div = document.createElement('div');
    div.scrollIntoView = mockScrollIntoView;
    div.addEventListener = mockAddEventListener;
    div.removeEventListener = mockRemoveEventListener;

    // Mock element properties
    Object.defineProperties(div, {
      scrollHeight: { value: 1000, configurable: true },
      scrollTop: { value: 0, configurable: true },
      clientHeight: { value: 500, configurable: true }
    });

    // Mock createElement to return our div
    vi.spyOn(document, 'createElement').mockReturnValue(div);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('initializes with refs', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    expect(result.current.scrollContainerRef.current).toBe(null);
    expect(result.current.messagesEndRef.current).toBe(null);
    expect(typeof result.current.handleContentUpdate).toBe('function');
  });

  test('scrolls to bottom on new user message', () => {
    const messages: Message[] = [{ id: '1', role: 'user', content: 'test' }];
    
    const { result } = renderHook(() => useChatScroll({ messages, isTyping: false }));

    // Set up refs
    const container = document.createElement('div');
    const messagesEnd = document.createElement('div');
    
    Object.defineProperty(result.current.scrollContainerRef, 'current', {
      value: container,
      writable: true
    });
    
    Object.defineProperty(result.current.messagesEndRef, 'current', {
      value: messagesEnd,
      writable: true
    });

    act(() => {
      vi.runAllTimers();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ 
      behavior: 'auto', 
      block: 'end' 
    });
  });

  test('handles scroll events with debounce', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    const container = document.createElement('div');
    Object.defineProperty(result.current.scrollContainerRef, 'current', {
      value: container,
      writable: true
    });

    act(() => {
      container.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(150);
    });
    
    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});