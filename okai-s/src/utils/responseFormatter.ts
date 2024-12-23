import type { Message } from '../types';
import type { AIPersona } from '../config/personas/types';
import { formatPersonaResponse } from './personaFormatter';
import { ValidationError } from './errors';
import { logger } from './logger';

export function formatResponse(message: Message, persona: AIPersona): Message {
  try {
    if (!message.content) {
      throw new ValidationError('Message content is required');
    }

    if (message.role !== 'assistant') {
      throw new ValidationError('Can only format assistant messages');
    }

    const formattedContent = formatPersonaResponse(message.content, persona);

    if (!formattedContent) {
      throw new ValidationError('Failed to format response content');
    }

    return {
      ...message,
      content: formattedContent
    };
  } catch (error) {
    logger.error('Error formatting response:', { error, message });
    throw error instanceof ValidationError ? error : new ValidationError('Response formatting failed');
  }
}