import type { AIPersona } from './types';

// Mock personas for testing
const mockPersonas = {
  okai: {
    name: 'Okai',
    description: 'Test persona',
    systemPrompt: 'Test prompt',
    knowledgeBases: ['okcash', 'anime']
  },
  elonmusk: {
    name: 'Elon Musk',
    description: 'Test persona',
    systemPrompt: 'Test prompt',
    displayOrder: 2
  }
} as Record<string, AIPersona>;

export function loadPersonas(): Record<string, AIPersona> {
  // In a test environment, return mock data
  if (import.meta.env.MODE === 'test') {
    return mockPersonas;
  }

  // In development/production, load actual personas
  const personaContext = import.meta.glob<{ default: AIPersona }>('./*.ts', { 
    eager: true 
  });

  return Object.entries(personaContext).reduce((acc, [path, module]) => {
    if (path.includes('index.ts') || 
        path.includes('types.ts') || 
        path.includes('loadPersonas.ts')) {
      return acc;
    }
    
    const key = path.replace(/^.*\/(.+)\.ts$/, '$1');
    
    if (module.default) {
      acc[key] = module.default;
    }
    
    return acc;
  }, {} as Record<string, AIPersona>);
}