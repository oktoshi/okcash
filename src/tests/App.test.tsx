import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { sendMessage } from '../api';

// Mock dependencies
vi.mock('../api');
vi.mock('../utils/logger');
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');

describe('App', () => {
  beforeEach(() => {
    // Reset mocks
    vi.mocked(sendMessage).mockResolvedValue({
      content: 'Test response'
    });
  });

  test('renders chat interface', () => {
    render(<App />);
    expect(screen.getByText(/Start a conversation/)).toBeInTheDocument();
  });

  test('sends message and displays response', async () => {
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

    expect(sendMessage).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'user',
          content: 'Hello'
        })
      ]),
      expect.any(Object)
    );
  });

  test('changes persona', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const personaButton = screen.getByText('Elon Musk');
    await user.click(personaButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Start a conversation with Elon Musk/)).toBeInTheDocument();
    });
  });

  test('handles loading state', async () => {
    const user = userEvent.setup();
    vi.mocked(sendMessage).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ content: 'Test response' }), 100))
    );

    render(<App />);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    const button = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Hello');
    await user.click(button);

    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('typing-indicator')).not.toBeInTheDocument();
    });
  });
});