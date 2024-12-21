import { describe, test, expect } from 'vitest';
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
        shouldAnimate={true}
      />
    );
    expect(screen.getByText('Bold')).toHaveStyle('font-weight: bold');
  });
});