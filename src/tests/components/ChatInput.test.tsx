import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '../../components/ChatInput';
import { ChatFocusContext } from '../../hooks/useChatFocus';

describe('ChatInput', () => {
  const mockOnSend = vi.fn();
  const mockInputRef = { current: null };
  const mockFocusInput = vi.fn();

  const renderWithContext = (disabled = false) => {
    return render(
      <ChatFocusContext.Provider value={{ inputRef: mockInputRef, focusInput: mockFocusInput }}>
        <ChatInput onSend={mockOnSend} disabled={disabled} />
      </ChatFocusContext.Provider>
    );
  };

  test('sends message on submit', async () => {
    const user = userEvent.setup();
    renderWithContext();
    
    const input = screen.getByPlaceholderText(/Type your message/);
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });
});