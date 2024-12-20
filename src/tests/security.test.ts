import { describe, test, expect } from 'vitest';
import { 
  sanitizeInput, 
  validateContentSecurity, 
  validateToken,
  safeJSONParse,
  generateSecureId,
  validateContentType,
  escapeHtml,
  generateHash
} from '../utils/security';

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
  });

  describe('validateContentSecurity', () => {
    test('rejects content with script tags', () => {
      const content = '<script>alert("xss")</script>';
      expect(validateContentSecurity(content)).toBe(false);
    });

    test('rejects content with eval', () => {
      const content = 'eval("alert(1)")';
      expect(validateContentSecurity(content)).toBe(false);
    });

    test('rejects content exceeding max length', () => {
      const content = 'a'.repeat(5000);
      expect(validateContentSecurity(content)).toBe(false);
    });

    test('accepts safe content', () => {
      const content = 'Hello, this is safe content!';
      expect(validateContentSecurity(content)).toBe(true);
    });
  });

  describe('generateHash', () => {
    test('generates consistent hash', async () => {
      const data = 'test data';
      const hash1 = await generateHash(data);
      const hash2 = await generateHash(data);
      expect(hash1).toBe(hash2);
    });

    test('generates different hashes for different data', async () => {
      const hash1 = await generateHash('data1');
      const hash2 = await generateHash('data2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validateToken', () => {
    test('validates correct JWT format', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      expect(validateToken(token)).toBe(true);
    });

    test('rejects invalid token format', () => {
      const token = 'invalid-token';
      expect(validateToken(token)).toBe(false);
    });
  });

  describe('generateSecureId', () => {
    test('generates id of correct length', () => {
      const id = generateSecureId(16);
      expect(id).toHaveLength(32); // Each byte becomes 2 hex chars
    });

    test('generates unique ids', () => {
      const id1 = generateSecureId();
      const id2 = generateSecureId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('validateContentType', () => {
    test('accepts valid content types', () => {
      expect(validateContentType('text/plain')).toBe(true);
      expect(validateContentType('application/json')).toBe(true);
    });

    test('rejects invalid content types', () => {
      expect(validateContentType('application/javascript')).toBe(false);
      expect(validateContentType('text/html')).toBe(false);
    });
  });

  describe('escapeHtml', () => {
    test('escapes HTML special characters', () => {
      const input = '<script>alert("&")</script>';
      const escaped = escapeHtml(input);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).not.toContain('"');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
      expect(escaped).toContain('&quot;');
    });
  });
});