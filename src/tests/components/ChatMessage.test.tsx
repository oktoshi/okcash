```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
        shouldAnimate={false}
      />
    );
    const container = screen.getByText(/text/i).parentElement;
    expect(container).toContainHTML('<strong>Bold</strong>');
  });

  test('shows typing indicator', () => {
    render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: 'Loading...' }}
        isTyping={true}
      />
    );
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
  });

  test('handles animation completion', () => {
    const onComplete = vi.fn();
    
    render(
      <ChatMessage
        message={{ id: '1', role: 'user', content: 'Test' }}
        shouldAnimate={false}
        onAnimationComplete={onComplete}
      />
    );

    expect(onComplete).toHaveBeenCalled();
  });
});
```