export interface AIPersona {
  name: string;
  description: string;
  systemPrompt: string;
  knowledgeBases?: string[]; // Array of knowledge base names to use
  customKnowledge?: string[]; // Additional custom knowledge topics
  displayOrder?: number;
  model?: string; // Optional model override
}

export interface PersonaConfig {
  [key: string]: AIPersona;
}