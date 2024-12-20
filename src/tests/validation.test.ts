import { describe, test, expect } from 'vitest';
import { validateMessages, validatePersona, validateKnowledgeBase } from '../utils/validation';

describe('validation', () => {
  describe('validateMessages', () => {
    test('validates correct message array', () => {
      const messages = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there' }
      ];
      expect(() => validateMessages(messages)).not.toThrow();
    });

    test('rejects invalid role', () => {
      const messages = [
        { role: 'invalid', content: 'Hello' }
      ];
      expect(() => validateMessages(messages)).toThrow();
    });

    test('rejects empty content', () => {
      const messages = [
        { role: 'user', content: '' }
      ];
      expect(() => validateMessages(messages)).toThrow();
    });
  });

  describe('validatePersona', () => {
    test('validates correct persona', () => {
      const persona = {
        name: 'Test',
        description: 'Test persona',
        systemPrompt: 'You are a test persona',
        knowledgeBases: ['test'],
        model: 'test-model'
      };
      expect(() => validatePersona(persona)).not.toThrow();
    });

    test('rejects missing required fields', () => {
      const persona = {
        name: 'Test'
      };
      expect(() => validatePersona(persona)).toThrow();
    });
  });

  describe('validateKnowledgeBase', () => {
    test('validates correct knowledge base', () => {
      const kb = {
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
  });
});