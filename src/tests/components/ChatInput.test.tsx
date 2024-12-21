import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('sends message on submit', async () => {
    const user = userEvent.setup();
    renderWithContext();
    
    const input = screen.getByPlaceholderText(/Type your message/);
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  test('prevents empty message submission', async () => {
    const user = userEvent.setup();
    renderWithContext();
    
    const input = screen.getByPlaceholderText(/Type your message/);
    await user.keyboard('{Enter}');

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  test('disables input when loading', () => {
    renderWithContext(true);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });

  test('auto-focuses after response', async () => {
    renderWithContext(true);
    
    // Re-render with disabled false to simulate response received
    renderWithContext(false);
    
    await waitFor(() => {
      expect(mockFocusInput).toHaveBeenCalled();
    });
  });
});