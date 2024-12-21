import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
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

  test('scrolls to bottom on new user message', () => {
    const messages = [
      { id: '1', role: 'user', content: 'Hello' }
    ];

    const { result } = renderHook(() => useChatScroll({ 
      messages, 
      isTyping: false 
    }));

    expect(result.current.scrollContainerRef).toBeDefined();
    expect(result.current.messagesEndRef).toBeDefined();
  });

  test('handles content updates during typing', () => {
    const { result } = renderHook(() => useChatScroll({ 
      messages: [], 
      isTyping: true 
    }));

    result.current.handleContentUpdate();
    expect(mockScrollIntoView).toHaveBeenCalled();
  });
});