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
    
    renderHook(() => useChatScroll({ messages, isTyping: false }));
    
    act(() => {
      vi.runAllTimers();
    });

    expect(mockScrollIntoView).toHaveBeenCalledWith({ 
      behavior: 'auto', 
      block: 'end' 
    });
  });

  test('handles content updates', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    act(() => {
      result.current.handleContentUpdate();
      vi.runAllTimers();
    });

    expect(mockScrollIntoView).toHaveBeenCalled();
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

  test('cleans up event listeners', () => {
    const { unmount } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});