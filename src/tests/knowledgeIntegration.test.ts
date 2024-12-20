import { describe, test, expect } from 'vitest';
import { integrateKnowledge } from '../utils/knowledgeIntegration';
import { personas } from '../config/personas';

describe('knowledgeIntegration', () => {
  test('integrates persona custom knowledge', () => {
    const result = integrateKnowledge(personas.okai);
    expect(result.topics).toContain('Video games');
    expect(result.topics).toContain('Programming');
  });

  test('integrates knowledge base topics', () => {
    const result = integrateKnowledge(personas.okai);
    expect(result.topics).toContain('Blockchain fundamentals');
    expect(result.topics).toContain('Digital wallets');
  });

  test('integrates knowledge base Q&As', () => {
    const result = integrateKnowledge(personas.okai);
    const stakingQA = result.qa.find(qa => 
      qa.question.toLowerCase().includes('stake') && 
      qa.category === 'staking'
    );
    expect(stakingQA).toBeDefined();
    expect(stakingQA?.source).toBe('Okcash');
  });

  test('handles missing knowledge bases gracefully', () => {
    const testPersona = {
      ...personas.okai,
      knowledgeBases: ['nonexistent']
    };
    const result = integrateKnowledge(testPersona);
    expect(result.topics).toEqual(testPersona.customKnowledge || []);
    expect(result.qa).toEqual([]);
  });
});