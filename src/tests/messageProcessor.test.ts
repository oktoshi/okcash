import { describe, test, expect, vi, beforeEach } from 'vitest';
import { processMessage, processMessages } from '../utils/messageProcessor';
import { ValidationError } from '../utils/errors';
import * as security from '../utils/security';
import * as validation from '../utils/validation';
import type { Message } from '../types';

vi.mock('../utils/security', () => ({
  sanitizeInput: vi.fn(str => str),
  validateContentSecurity: vi.fn(() => true)
}));

vi.mock('../utils/validation');
vi.mock('../utils/logger');

describe('messageProcessor', () => {
  const validMessage: Message = { 
    id: '1', 
    role: 'user', 
    content: 'Hello' 
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validation.validateMessages).mockReturnValue([validMessage]);
  });

  describe('processMessage', () => {
    test('processes valid message', () => {
      const result = processMessage(validMessage);
      expect(result).toEqual(validMessage);
      expect(security.sanitizeInput).toHaveBeenCalledWith(validMessage.content);
      expect(security.validateContentSecurity).toHaveBeenCalled();
      expect(validation.validateMessages).toHaveBeenCalledWith([validMessage]);
    });

    test('throws on validation failure', () => {
      vi.mocked(validation.validateMessages).mockImplementationOnce(() => {
        throw new ValidationError('Invalid message');
      });
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
    });

    test('throws on empty content after sanitization', () => {
      vi.mocked(security.sanitizeInput).mockReturnValueOnce('');
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
    });

    test('throws on security validation failure', () => {
      vi.mocked(security.validateContentSecurity).mockReturnValueOnce(false);
      expect(() => processMessage(validMessage)).toThrow(ValidationError);
    });
  });

  describe('processMessages', () => {
    test('processes array of valid messages', () => {
      const messages = [validMessage];
      const result = processMessages(messages);
      expect(result).toEqual(messages);
      expect(validation.validateMessages).toHaveBeenCalledWith(messages);
    });

    test('throws on non-array input', () => {
      expect(() => processMessages('not an array' as unknown as Message[]))
        .toThrow(ValidationError);
    });

    test('throws on empty array', () => {
      expect(() => processMessages([]))
        .toThrow(ValidationError);
    });

    test('throws on too many messages', () => {
      const messages = Array(101).fill(validMessage);
      expect(() => processMessages(messages))
        .toThrow(ValidationError);
    });

    test('processes each message in array', () => {
      const messages = [validMessage, { ...validMessage, id: '2' }];
      vi.mocked(validation.validateMessages).mockReturnValue(messages);
      const result = processMessages(messages);
      expect(result).toHaveLength(2);
      expect(security.sanitizeInput).toHaveBeenCalledTimes(2);
    });
  });
});