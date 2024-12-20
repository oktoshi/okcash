import { z } from 'zod';

// Message validation schema
export const messageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message too long')
    .transform(str => str.trim())
});

// Persona validation schema
export const personaSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  systemPrompt: z.string().min(1),
  knowledgeBases: z.array(z.string()).optional(),
  customKnowledge: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  model: z.string().optional()
});

// Knowledge base validation schema
export const knowledgeBaseSchema = z.object({
  name: z.string().min(1),
  topics: z.record(z.array(z.string())),
  prompts: z.record(z.string()),
  sampleQA: z.record(z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1)
  }))).optional()
});

// Validate message array
export function validateMessages(messages: unknown[]) {
  return z.array(messageSchema).parse(messages);
}

// Validate persona
export function validatePersona(persona: unknown) {
  return personaSchema.parse(persona);
}

// Validate knowledge base
export function validateKnowledgeBase(kb: unknown) {
  return knowledgeBaseSchema.parse(kb);
}