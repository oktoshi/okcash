import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('renders input field', () => {
    renderWithContext();
    expect(screen.getByPlaceholderText(/Type your message/)).toBeInTheDocument();
  });

  test('handles message submission', async () => {
    const user = userEvent.setup();
    renderWithContext();
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button');

    await user.type(input, 'Hello');
    await user.click(button);

    expect(mockOnSend).toHaveBeenCalledWith('Hello');
    expect(input).toHaveValue('');
  });

  test('prevents empty message submission', async () => {
    const user = userEvent.setup();
    renderWithContext();
    
    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  test('disables input when loading', () => {
    renderWithContext(true);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
  });
});