import { describe, test, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  test('renders assistant message with markdown', () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: '**Bold** text' }}
        isTyping={false}
        shouldAnimate={true}
      />
    );
    const element = screen.getByText(/Bold/);
    expect(element).toBeInTheDocument();
    expect(element.tagName.toLowerCase()).toBe('strong');
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
        message={{ id: '1', role: 'assistant', content: 'Test' }}
        shouldAnimate={true}
        onAnimationComplete={onComplete}
      />
    );

    // Wait for animation to complete
    await vi.waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });
});