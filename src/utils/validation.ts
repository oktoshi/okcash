import { z } from 'zod';
import { logger } from './logger';
import type { Message } from '../types';
import type { AIPersona } from '../config/personas/types';
import type { KnowledgeBase } from '../config/knowledge/types';
import { ValidationError } from './errors';

// Message validation schema
const messageSchema = z.object({
  id: z.string().min(1, 'Message ID is required'),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message too long')
    .transform(str => str.trim())
});

// Persona validation schema
const personaSchema = z.object({
  name: z.string().min(1, 'Persona name is required'),
  description: z.string().min(1, 'Persona description is required'),
  systemPrompt: z.string().min(1, 'System prompt is required'),
  knowledgeBases: z.array(z.string()).optional(),
  customKnowledge: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  model: z.string().optional()
});

// Knowledge base validation schema
const knowledgeBaseSchema = z.object({
  name: z.string().min(1, 'Knowledge base name is required'),
  topics: z.record(z.array(z.string())),
  prompts: z.record(z.string()),
  sampleQA: z.record(z.array(z.object({
    question: z.string().min(1),
    answer: z.string().min(1)
  }))).optional()
});

export function validateMessages(messages: unknown): Message[] {
  try {
    if (!Array.isArray(messages)) {
      throw new ValidationError('Messages must be an array');
    }
    
    if (messages.length === 0) {
      throw new ValidationError('Messages array cannot be empty');
    }

    return z.array(messageSchema).parse(messages);
  } catch (error) {
    logger.error('Message validation failed:', error);
    throw error instanceof ValidationError ? error : new ValidationError('Invalid messages');
  }
}

export function validatePersona(persona: unknown): AIPersona {
  try {
    return personaSchema.parse(persona);
  } catch (error) {
    logger.error('Persona validation failed:', error);
    throw new ValidationError('Invalid persona configuration');
  }
}

export function validateKnowledgeBase(kb: unknown): KnowledgeBase {
  try {
    return knowledgeBaseSchema.parse(kb);
  } catch (error) {
    logger.error('Knowledge base validation failed:', error);
    throw new ValidationError('Invalid knowledge base configuration');
  }
}