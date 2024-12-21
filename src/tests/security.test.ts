import { describe, test, expect } from 'vitest';
import { 
  sanitizeInput, 
  validateContentSecurity, 
  validateToken,
  generateSecureId
} from '../utils/security';
import { ValidationError } from '../utils/errors';

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

    test('removes dangerous keywords', () => {
      const input = 'javascript:alert(1) script eval';
      expect(sanitizeInput(input)).toBe('1');
    });

    test('normalizes whitespace', () => {
      const input = 'Hello    World   !';
      expect(sanitizeInput(input)).toBe('Hello World !');
    });

    test('handles empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  // Rest of the tests remain unchanged...
});