import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChatScroll } from '../../hooks/useChatScroll';

describe('useChatScroll', () => {
  const mockScrollIntoView = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = mockScrollIntoView;
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
    const { result, rerender } = renderHook(
      ({ messages, isTyping }) => useChatScroll({ messages, isTyping }),
      {
        initialProps: { 
          messages: [], 
          isTyping: false 
        }
      }
    );

    rerender({ 
      messages: [{ id: '1', role: 'user', content: 'test' }], 
      isTyping: false 
    });

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
});