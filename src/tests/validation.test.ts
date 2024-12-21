import { describe, test, expect, vi } from 'vitest';
import { validateMessages, validatePersona, validateKnowledgeBase } from '../utils/validation';
import { ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import type { Message } from '../types';
import type { AIPersona } from '../config/personas/types';
import type { KnowledgeBase } from '../config/knowledge/types';

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

    test('rejects empty array', () => {
      expect(() => validateMessages([]))
        .toThrow(ValidationError);
    });

    test('rejects non-array input', () => {
      expect(() => validateMessages('not an array'))
        .toThrow(ValidationError);
    });

    test('rejects messages without ID', () => {
      const messages = [{ role: 'user', content: 'Hello' }];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects empty content', () => {
      const messages = [{ id: '1', role: 'user', content: '' }];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects invalid role', () => {
      const messages = [{ id: '1', role: 'invalid', content: 'Hello' }];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('logs validation errors', () => {
      try {
        validateMessages([]);
      } catch (error) {
        expect(logger.error).toHaveBeenCalled();
      }
    });
  });

  describe('validatePersona', () => {
    test('validates correct persona', () => {
      const persona: AIPersona = {
        name: 'Test',
        description: 'Test persona',
        systemPrompt: 'You are a test persona'
      };
      expect(() => validatePersona(persona)).not.toThrow();
    });

    test('rejects invalid persona', () => {
      const invalidPersona = {
        name: 'Test'
      };
      expect(() => validatePersona(invalidPersona))
        .toThrow(ValidationError);
    });
  });

  describe('validateKnowledgeBase', () => {
    test('validates correct knowledge base', () => {
      const kb: KnowledgeBase = {
        name: 'Test',
        topics: {
          general: ['Topic 1', 'Topic 2']
        },
        prompts: {
          default: 'Test prompt'
        }
      };
      expect(() => validateKnowledgeBase(kb)).not.toThrow();
    });

    test('rejects invalid knowledge base', () => {
      const invalidKb = {
        name: 'Test'
      };
      expect(() => validateKnowledgeBase(invalidKb))
        .toThrow(ValidationError);
    });
  });
});