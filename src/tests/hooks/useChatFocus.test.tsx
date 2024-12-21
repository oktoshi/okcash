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

  test('throws when used outside provider', () => {
    const { result } = renderHook(() => useChatFocus());
    expect(result.error).toEqual(Error('useChatFocus must be used within a ChatFocusProvider'));
  });

  test('provides context value to children', () => {
    const TestProvider = ({ children }: { children: React.ReactNode }) => {
      const context = useChatFocusProvider();
      return (
        <ChatFocusContext.Provider value={context}>
          {children}
        </ChatFocusContext.Provider>
      );
    };

    const TestChild = () => {
      const { focusInput } = useChatFocus();
      return <button onClick={focusInput}>Focus</button>;
    };

    const { getByText } = render(
      <TestProvider>
        <TestChild />
      </TestProvider>
    );

    expect(getByText('Focus')).toBeInTheDocument();
  });
});