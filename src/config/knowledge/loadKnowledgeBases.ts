import type { KnowledgeBase } from './types';

// Mock knowledge bases for testing
const mockKnowledgeBases = {
  okcash: {
    name: 'Okcash',
    topics: { basics: ['Test Topic'] },
    prompts: { default: 'Test prompt' }
  },
  anime: {
    name: 'Anime',
    topics: { general: ['Test Topic'] },
    prompts: { default: 'Test prompt' }
  }
} as Record<string, KnowledgeBase>;

export function loadKnowledgeBases(): Record<string, KnowledgeBase> {
  // In a test environment, return mock data
  if (import.meta.env.MODE === 'test') {
    return mockKnowledgeBases;
  }

  // In development/production, load actual knowledge bases
  const knowledgeContext = import.meta.glob<{ default: KnowledgeBase }>('./*.ts', { 
    eager: true 
  });

  return Object.entries(knowledgeContext).reduce((acc, [path, module]) => {
    if (path.includes('index.ts') || 
        path.includes('types.ts') || 
        path.includes('loadKnowledgeBases.ts')) {
      return acc;
    }
    
    const key = path.replace(/^.*\/(.+)\.ts$/, '$1');
    
    if (module.default) {
      acc[key] = module.default;
    }
    
    return acc;
  }, {} as Record<string, KnowledgeBase>);
}