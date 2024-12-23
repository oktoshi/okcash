import type { AIPersona } from './types';

// Import all persona files dynamically
const personaContext = import.meta.glob<{ default: AIPersona }>('./*.ts', { 
  eager: true 
});

// Convert the imported modules into a personas object
export function loadPersonas(): Record<string, AIPersona> {
  return Object.entries(personaContext).reduce((acc, [path, module]) => {
    // Skip non-persona files
    if (path.includes('index.ts') || 
        path.includes('types.ts') || 
        path.includes('loadPersonas.ts')) {
      return acc;
    }
    
    // Extract the filename without extension as the key
    const key = path.replace(/^.*\/(.+)\.ts$/, '$1').toLowerCase();
    
    // Add the persona to the accumulator
    if (module.default) {
      acc[key] = module.default;
    }
    
    return acc;
  }, {} as Record<string, AIPersona>);
}