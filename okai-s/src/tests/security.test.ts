import { describe, test, expect } from 'vitest';
import { sanitizeInput } from '../utils/security';

describe('security', () => {
  describe('sanitizeInput', () => {
    test('removes HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    test('removes special characters', () => {
      const input = 'Hello@#$%^&*()World';
      expect(sanitizeInput(input)).toBe('Hello World');
    });

    test('preserves basic punctuation', () => {
      const input = 'Hello, world! How are you?';
      expect(sanitizeInput(input)).toBe('Hello, world! How are you?');
    });

    test('normalizes whitespace', () => {
      const input = 'Hello    World   !';
      expect(sanitizeInput(input)).toBe('Hello World !');
    });

    test('handles empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });

    test('removes dangerous keywords', () => {
      const input = 'javascript:alert() onclick=evil() script:bad()';
      expect(sanitizeInput(input)).toBe('alert evil bad');
    });
  });
});