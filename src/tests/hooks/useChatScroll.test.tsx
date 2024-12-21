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
  });

  test('initializes with refs', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    expect(result.current.scrollContainerRef).toBeDefined();
    expect(result.current.messagesEndRef).toBeDefined();
    expect(result.current.handleContentUpdate).toBeDefined();
  });

  test('scrolls to bottom on new user message', () => {
    const messages: Message[] = [{ id: '1', role: 'user', content: 'test' }];
    const { result, rerender } = renderHook(
      ({ messages, isTyping }) => useChatScroll({ messages, isTyping }),
      {
        initialProps: { 
          messages: [], 
          isTyping: false 
        }
      }
    );

    rerender({ messages, isTyping: false });

    result.current.handleContentUpdate();
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  test('scrolls to bottom when typing starts', () => {
    const { rerender } = renderHook(
      ({ messages, isTyping }) => useChatScroll({ messages, isTyping }),
      {
        initialProps: { 
          messages: [], 
          isTyping: false 
        }
      }
    );

    rerender({ 
      messages: [], 
      isTyping: true 
    });

    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  test('adds and removes scroll listener', () => {
    const { unmount } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    
    unmount();
    
    expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});