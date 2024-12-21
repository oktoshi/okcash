import { describe, test, expect, vi } from 'vitest';
import { processMessage, processMessages } from '../utils/messageProcessor';
import { ValidationError } from '../utils/errors';
import * as security from '../utils/security';
import { logger } from '../utils/logger';

vi.mock('../utils/security', () => ({
  sanitizeInput: vi.fn(str => str),
  validateContentSecurity: vi.fn(() => true)
}));

vi.mock('../utils/logger');

describe('messageProcessor', () => {
  const validMessage = { id: '1', role: 'user' as const, content: 'Hello' };

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
      const message = { role: 'user' as const, content: 'Hello' };
      expect(() => processMessage(message as any)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('throws on invalid role', () => {
      const message = { ...validMessage, role: 'invalid' };
      expect(() => processMessage(message as any)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('throws on empty content after sanitization', () => {
      vi.mocked(security.sanitizeInput).mockReturnValueOnce('');
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('throws on security validation failure', () => {
      vi.mocked(security.validateContentSecurity).mockReturnValueOnce(false);
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('processMessages', () => {
    test('processes array of valid messages', () => {
      const messages = [validMessage, { ...validMessage, id: '2' }];
      const results = processMessages(messages);
      expect(results).toHaveLength(2);
      expect(security.sanitizeInput).toHaveBeenCalledTimes(2);
    });

    test('throws on non-array input', () => {
      expect(() => processMessages('not an array' as any)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('throws on empty array', () => {
      expect(() => processMessages([])).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });

    test('propagates validation errors from processMessage', () => {
      const messages = [validMessage, { id: '2', role: 'invalid', content: 'test' } as any];
      expect(() => processMessages(messages)).toThrow(ValidationError);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});