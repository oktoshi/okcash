import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { sendMessage } from '../api';

// Mock dependencies
vi.mock('../api', () => ({
  sendMessage: vi.fn()
}));

vi.mock('../utils/logger');
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders chat interface', () => {
    render(<App />);
    expect(screen.getByText(/Start a conversation/)).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
    vi.mocked(sendMessage).mockResolvedValue({
      id: '1',
      role: 'assistant',
      content: 'Test response'
    });

    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Hello');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
      expect(screen.getByText('Test response')).toBeInTheDocument();
    });
  });

  test('handles loading state', async () => {
    vi.mocked(sendMessage).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        id: '1',
        role: 'assistant',
        content: 'Test response'
      }), 100))
    );

    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Hello');
    await user.click(button);

    expect(button).toBeDisabled();
    
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});