import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
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
    
    result.current.focusInput();
    expect(mockFocus).toHaveBeenCalled();
  });

  test('handles null input ref', () => {
    const { result } = renderHook(() => useChatFocusProvider());
    
    // Ensure ref is null
    result.current.inputRef.current = null;
    
    // Should not throw
    expect(() => result.current.focusInput()).not.toThrow();
  });

  test('throws when used outside provider', () => {
    const TestComponent = () => {
      const { focusInput } = useChatFocus();
      return <button onClick={focusInput}>Focus</button>;
    };

    expect(() => render(<TestComponent />))
      .toThrow('useChatFocus must be used within a ChatFocusProvider');
  });

  test('provides context value to children', () => {
    const TestComponent = () => {
      const { focusInput } = useChatFocus();
      return <button onClick={focusInput}>Focus</button>;
    };

    const { getByText } = render(
      <ChatFocusContext.Provider value={useChatFocusProvider()}>
        <TestComponent />
      </ChatFocusContext.Provider>
    );

    expect(getByText('Focus')).toBeInTheDocument();
  });
});