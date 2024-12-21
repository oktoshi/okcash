import { describe, test, expect, vi } from 'vitest';
import { validateMessages, validatePersona, validateKnowledgeBase } from '../utils/validation';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import type { Message } from '../types';

vi.mock('../utils/logger');

describe('validation', () => {
  describe('validateMessages', () => {
    test('validates correct message array', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' }
      ];
      const result = validateMessages(messages);
      expect(result).toEqual(messages);
    });

    test('validates message sequence', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'assistant', content: 'Hi' },
        { id: '3', role: 'user', content: 'How are you?' }
      ];
      const result = validateMessages(messages);
      expect(result).toEqual(messages);
    });

    test('rejects invalid message sequence', () => {
      const messages = [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'assistant', content: 'Hi' }
      ] as Message[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects non-array input', () => {
      expect(() => validateMessages('not an array'))
        .toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('rejects empty array', () => {
      expect(() => validateMessages([]))
        .toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('rejects too many messages', () => {
      const messages = Array(101).fill({ 
        id: '1', 
        role: 'user', 
        content: 'test' 
      });
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects messages without ID', () => {
      const messages = [{ role: 'user', content: 'Hello' }] as unknown[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects invalid role', () => {
      const messages = [{ 
        id: '1', 
        role: 'invalid', 
        content: 'Hello' 
      }] as unknown[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });
  });
});