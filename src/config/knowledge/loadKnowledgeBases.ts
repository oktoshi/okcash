import type { KnowledgeBase } from './types';

const knowledgeContext = import.meta.glob<{ default: KnowledgeBase }>('./*.ts', { 
  eager: true 
});

export function loadKnowledgeBases() {
  const bases = Object.entries(knowledgeContext).reduce((acc, [path, module]) => {
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

  return bases;
}