import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatScroll } from '../../hooks/useChatScroll';

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

  test('scrolls to bottom on new message', () => {
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

    act(() => {
      result.current.handleContentUpdate();
    });

    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  test('cleans up event listeners', () => {
    const { unmount } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: false 
    }));

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});