import { loadPersonas } from './loadPersonas';
import type { AIPersona } from './types';

// Load all personas
const allPersonas = loadPersonas();

// Set okai as default, or first persona if okai doesn't exist
const defaultPersona = allPersonas.okai || Object.values(allPersonas)[0];

if (!defaultPersona) {
  throw new Error('No personas found in the personas directory!');
}

// Export the final personas object with default
export const personas = {
  ...allPersonas,
  default: defaultPersona
} as const;