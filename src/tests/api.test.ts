import { describe, test, expect, vi } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import type { AIPersona } from '../config/personas/types';

vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        })
      }
    }
  }
}));

describe('sendMessage', () => {
  const testPersona: AIPersona = personas.okai;
  const testMessages = [
    { role: 'user', content: 'Hello' }
  ];

  test('sends message and returns response', async () => {
    const response = await sendMessage(testMessages, testPersona);
    expect(response).toBeDefined();
    expect(response?.content).toBeDefined();
  });

  test('integrates knowledge base correctly', async () => {
    const message = { role: 'user', content: 'How do I stake OK?' };
    const response = await sendMessage([message], testPersona);
    expect(response?.content).toContain('stake');
  });

  test('handles errors gracefully', async () => {
    vi.mocked(OpenAI.prototype.chat.completions.create).mockRejectedValueOnce(new Error('API Error'));
    await expect(sendMessage(testMessages, testPersona)).rejects.toThrow();
  });
});