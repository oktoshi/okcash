import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
    vi.clearAllMocks();
    vi.mocked(sendMessage).mockResolvedValue({
      id: '1',
      role: 'assistant',
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
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

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

  test('handles loading state', async () => {
    vi.mocked(sendMessage).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        id: '1',
        role: 'assistant',
        content: 'Test response'
      }), 100))
    );

    const user = userEvent.setup();
    render(<App />);
    
    const input = screen.getByPlaceholderText(/Type your message/);
    await user.type(input, 'Hello');
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button')).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });
  });

  test('changes persona', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const personaButton = screen.getByText('Elon Musk');
    await user.click(personaButton);
    
    expect(screen.getByText(/Start a conversation with Elon Musk/)).toBeInTheDocument();
  });
});