import { describe, test, expect } from 'vitest';
import { calculateSimilarity, extractKeyTerms } from '../utils/textMatching';

describe('textMatching', () => {
  describe('calculateSimilarity', () => {
    test('matches exact strings', () => {
      const similarity = calculateSimilarity(
        'How do I stake OK?',
        'How do I stake OK?'
      );
      expect(similarity).toBeGreaterThan(0.8);
    });

    test('matches similar questions', () => {
      const similarity = calculateSimilarity(
        'How can I stake Okcash?',
        'How do I stake OK?'
      );
      expect(similarity).toBeGreaterThan(0.6);
    });

    test('low similarity for different topics', () => {
      const similarity = calculateSimilarity(
        'How do I stake OK?',
        'What is the weather today?'
      );
      expect(similarity).toBeLessThan(0.3);
    });
  });

  describe('extractKeyTerms', () => {
    test('extracts key terms', () => {
      const terms = extractKeyTerms('How do I stake Okcash?');
      expect(terms).toContain('stake');
      expect(terms).toContain('okcash');
    });

    test('removes common words', () => {
      const terms = extractKeyTerms('How do I stake?');
      expect(terms).not.toContain('how');
      expect(terms).not.toContain('do');
      expect(terms).not.toContain('i');
      expect(terms).toContain('stake');
    });

    test('handles empty input', () => {
      const terms = extractKeyTerms('');
      expect(terms).toEqual([]);
    });

    test('handles special characters', () => {
      const terms = extractKeyTerms('How do I stake OK?!@#$%^&*()');
      expect(terms).toContain('stake');
      expect(terms).toContain('ok');
    });
  });
});