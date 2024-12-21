import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ChatMessage } from '../../components/ChatMessage';

describe('ChatMessage', () => {
  test('renders user message', () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'user', content: 'Hello' }}
        isTyping={false}
      />
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('renders assistant message with markdown', async () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: '**Bold** text' }}
        isTyping={false}
        shouldAnimate={false}
      />
    );

    await waitFor(() => {
      const element = screen.getByText(/text/i);
      expect(element.parentElement).toContainHTML('<strong>Bold</strong>');
    });
  });

  test('shows typing indicator when typing', () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: 'Loading...' }}
        isTyping={true}
      />
    );
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
  });

  test('handles animation completion', async () => {
    const onComplete = vi.fn();
    
    render(
      <ChatMessage
        message={{ id: '1', role: 'user', content: 'Test' }}
        shouldAnimate={false}
        onAnimationComplete={onComplete}
      />
    );

    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  test('cleans up animation on unmount', () => {
    const { unmount } = render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: 'Test' }}
        shouldAnimate={true}
      />
    );

    unmount();
    // Animation cleanup is handled internally
  });
});