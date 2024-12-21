import type { KnowledgeBase } from './types';

// Import all knowledge base files dynamically
const knowledgeContext = import.meta.glob<{ default: KnowledgeBase }>('./*.ts', { 
  eager: true 
});

// Convert the imported modules into a knowledge bases object
export function loadKnowledgeBases(): Record<string, KnowledgeBase> {
  return Object.entries(knowledgeContext).reduce((acc, [path, module]) => {
    // Skip non-knowledge base files
    if (path.includes('index.ts') || 
        path.includes('types.ts') || 
        path.includes('loadKnowledgeBases.ts')) {
      return acc;
    }
    
    // Extract the filename without extension as the key
    const key = path.replace(/^.*\/(.+)\.ts$/, '$1').toLowerCase();
    
    // Add the knowledge base to the accumulator
    if (module.default) {
      acc[key] = module.default;
    }
    
    return acc;
  }, {} as Record<string, KnowledgeBase>);
}