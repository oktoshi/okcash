import { describe, test, expect, vi } from 'vitest';
import { processMessage, processMessages } from '../utils/messageProcessor';
import { ValidationError } from '../utils/errors';
import * as security from '../utils/security';
import type { Message } from '../types';

vi.mock('../utils/security', () => ({
  sanitizeInput: vi.fn(str => str),
  validateContentSecurity: vi.fn(() => true)
}));

describe('messageProcessor', () => {
  const validMessage: Message = { 
    id: '1', 
    role: 'user', 
    content: 'Hello' 
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('processMessage', () => {
    test('processes valid message', () => {
      const result = processMessage(validMessage);
      expect(result).toEqual(validMessage);
      expect(security.sanitizeInput).toHaveBeenCalledWith(validMessage.content);
      expect(security.validateContentSecurity).toHaveBeenCalled();
    });

    test('throws on missing id', () => {
      const message = { role: 'user', content: 'Hello' } as unknown as Message;
      expect(() => processMessage(message)).toThrow(ValidationError);
    });

    test('throws on invalid role', () => {
      const message = { ...validMessage, role: 'invalid' } as unknown as Message;
      expect(() => processMessage(message)).toThrow(ValidationError);
    });

    test('throws on empty content after sanitization', () => {
      vi.mocked(security.sanitizeInput).mockReturnValueOnce('');
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
    });
  });

  describe('processMessages', () => {
    test('processes array of valid messages', () => {
      const messages = [validMessage];
      const result = processMessages(messages);
      expect(result).toEqual(messages);
    });

    test('throws on non-array input', () => {
      expect(() => processMessages('not an array' as unknown as Message[]))
        .toThrow(ValidationError);
    });

    test('throws on empty array', () => {
      expect(() => processMessages([]))
        .toThrow(ValidationError);
    });

    test('throws if any message is invalid', () => {
      const messages = [
        validMessage,
        { role: 'invalid', content: 'test' } as unknown as Message
      ];
      expect(() => processMessages(messages))
        .toThrow(ValidationError);
    });
  });
});