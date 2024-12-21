import { describe, test, expect, vi, beforeEach } from 'vitest';
import { integrateKnowledge, findBestMatch } from '../utils/knowledgeIntegration';
import { personas } from '../config/personas';
import { cache } from '../utils/cache';

vi.mock('../utils/cache');

describe('knowledgeIntegration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findBestMatch', () => {
    test('finds matching QA from knowledge base', async () => {
      const message = 'How do I stake OK?';
      const result = await findBestMatch(message, personas.okai);
      expect(result).toBeDefined();
      expect(result?.similarity).toBeGreaterThan(0.25);
    });

    test('returns null for no match', async () => {
      const message = 'completely unrelated question';
      const result = await findBestMatch(message, personas.okai);
      expect(result).toBeNull();
    });

    test('uses cache when available', async () => {
      const cachedMatch = {
        question: 'test',
        answer: 'test',
        category: 'test',
        source: 'test',
        similarity: 0.8
      };
      vi.mocked(cache.get).mockReturnValueOnce(cachedMatch);
      
      const result = await findBestMatch('test', personas.okai);
      expect(result).toEqual(cachedMatch);
      expect(cache.get).toHaveBeenCalled();
    });
  });

  describe('integrateKnowledge', () => {
    test('integrates multiple knowledge bases', async () => {
      const result = await integrateKnowledge({
        ...personas.okai,
        knowledgeBases: ['okcash', 'anime']
      });
      expect(result.topics.length).toBeGreaterThan(0);
      expect(result.prompts.length).toBeGreaterThan(0);
      expect(result.qa.length).toBeGreaterThan(0);
    });

    test('handles missing knowledge bases gracefully', async () => {
      const result = await integrateKnowledge({
        ...personas.okai,
        knowledgeBases: ['nonexistent']
      });
      expect(result.topics).toEqual(personas.okai.customKnowledge || []);
      expect(result.qa).toEqual([]);
    });

    test('deduplicates topics', async () => {
      const result = await integrateKnowledge({
        ...personas.okai,
        customKnowledge: ['duplicate', 'duplicate']
      });
      const duplicateCount = result.topics.filter(t => t === 'duplicate').length;
      expect(duplicateCount).toBe(1);
    });

    test('uses cache when available', async () => {
      const cachedKnowledge = {
        topics: ['cached'],
        prompts: ['cached'],
        qa: []
      };
      vi.mocked(cache.get).mockReturnValueOnce(cachedKnowledge);
      
      const result = await integrateKnowledge(personas.okai);
      expect(result).toEqual(cachedKnowledge);
      expect(cache.get).toHaveBeenCalled();
    });
  });
});