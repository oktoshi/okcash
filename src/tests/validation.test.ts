import { describe, test, expect } from 'vitest';
import { validateMessages, validatePersona, validateKnowledgeBase } from '../utils/validation';
import { ValidationError } from '../utils/errors';
import type { Message } from '../types';

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
      expect(() => validateMessages('not an array' as any))
        .toThrow(ValidationError);
    });

    test('rejects messages without ID', () => {
      const messages = [{ role: 'user', content: 'Hello' }] as any[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects invalid role', () => {
      const messages = [{ id: '1', role: 'invalid', content: 'Hello' }] as any[];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });

    test('rejects empty content', () => {
      const messages = [{ id: '1', role: 'user', content: '' }];
      expect(() => validateMessages(messages))
        .toThrow(ValidationError);
    });
  });

  describe('validatePersona', () => {
    test('validates correct persona', () => {
      const persona = {
        name: 'Test',
        description: 'Test persona',
        systemPrompt: 'You are a test persona'
      };
      expect(() => validatePersona(persona)).not.toThrow();
    });

    test('rejects missing required fields', () => {
      const persona = { name: 'Test' };
      expect(() => validatePersona(persona))
        .toThrow(ValidationError);
    });
  });

  describe('validateKnowledgeBase', () => {
    test('validates correct knowledge base', () => {
      const kb = {
        name: 'Test',
        topics: { general: ['Topic 1', 'Topic 2'] },
        prompts: { default: 'Test prompt' }
      };
      expect(() => validateKnowledgeBase(kb)).not.toThrow();
    });

    test('validates knowledge base with Q&As', () => {
      const kb = {
        name: 'Test',
        topics: { general: ['Topic'] },
        prompts: { default: 'Prompt' },
        sampleQA: {
          general: [{
            question: 'Test?',
            answer: 'Answer'
          }]
        }
      };
      expect(() => validateKnowledgeBase(kb)).not.toThrow();
    });

    test('rejects invalid knowledge base structure', () => {
      const kb = { name: 'Test' };
      expect(() => validateKnowledgeBase(kb))
        .toThrow(ValidationError);
    });
  });
});