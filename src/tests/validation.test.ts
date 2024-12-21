import { describe, test, expect, vi } from 'vitest';
import { validateMessages } from '../utils/validation';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import type { Message } from '../types';

vi.mock('../utils/logger');

describe('validation', () => {
  describe('validateMessages', () => {
    test('validates correct message array', () => {
      const messages: Message[] = [
        { id: '1', role: 'user', content: 'Hello' },
        { id: '2', role: 'assistant', content: 'Hi there' }
      ];
      const result = validateMessages(messages);
      expect(result).toEqual(messages);
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

    test('rejects messages without ID', () => {
      const messages = [{ role: 'user', content: 'Hello' }] as unknown[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('rejects invalid role', () => {
      const messages = [{ id: '1', role: 'invalid', content: 'Hello' }] as unknown[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});