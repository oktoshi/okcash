import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChatScroll } from '../../hooks/useChatScroll';
import type { Message } from '../../types';

describe('useChatScroll', () => {
  const mockScrollIntoView = vi.fn();
  const mockAddEventListener = vi.fn();
  const mockRemoveEventListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = mockScrollIntoView;
    Element.prototype.addEventListener = mockAddEventListener;
    Element.prototype.removeEventListener = mockRemoveEventListener;

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });
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
    
    renderHook(
      ({ messages, isTyping }) => useChatScroll({ messages, isTyping }),
      {
        initialProps: { messages, isTyping: false }
      }
    );

    expect(mockScrollIntoView).toHaveBeenCalledWith({ 
      behavior: 'auto', 
      block: 'end' 
    });
  });

  test('handles scroll events with debounce', () => {
    vi.useFakeTimers();
    
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    // Simulate scroll container ref being set
    const container = document.createElement('div');
    Object.defineProperty(result.current.scrollContainerRef, 'current', {
      value: container,
      writable: true
    });

    // Trigger multiple scroll events
    container.dispatchEvent(new Event('scroll'));
    container.dispatchEvent(new Event('scroll'));
    
    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    vi.runAllTimers();
    vi.useRealTimers();
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