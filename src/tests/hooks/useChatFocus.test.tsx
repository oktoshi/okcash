import { describe, test, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import { useChatFocusProvider, useChatFocus, ChatFocusContext } from '../../hooks/useChatFocus';

describe('useChatFocus', () => {
  test('provides input ref and focus function', () => {
    const { result } = renderHook(() => useChatFocusProvider());
    expect(result.current.inputRef).toBeDefined();
    expect(typeof result.current.focusInput).toBe('function');
  });

  test('focuses input element', () => {
    const { result } = renderHook(() => useChatFocusProvider());
    const mockFocus = vi.fn();
    
    // Mock input ref
    result.current.inputRef.current = { focus: mockFocus } as unknown as HTMLInputElement;
    
    act(() => {
      result.current.focusInput();
    });
    
    expect(mockFocus).toHaveBeenCalled();
  });

  test('handles null input ref', () => {
    const { result } = renderHook(() => useChatFocusProvider());
    
    // Ensure ref is null
    result.current.inputRef.current = null;
    
    act(() => {
      // Should not throw
      expect(() => result.current.focusInput()).not.toThrow();
    });
  });

  test('throws when used outside provider', () => {
    const { result } = renderHook(() => useChatFocus());
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('useChatFocus must be used within a ChatFocusProvider');
  });

  test('provides context value to children', () => {
    const TestComponent = () => {
      const context = useChatFocus();
      return <div>{context ? 'has context' : 'no context'}</div>;
    };

    const { getByText } = render(
      <ChatFocusContext.Provider value={useChatFocusProvider()}>
        <TestComponent />
      </ChatFocusContext.Provider>
    );

    expect(getByText('has context')).toBeInTheDocument();
  });
});