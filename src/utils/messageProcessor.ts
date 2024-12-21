import type { Message } from '../types';
import { sanitizeInput, validateContentSecurity } from './security';
import { ValidationError } from './errors';
import { logger } from './logger';

export function processMessage(message: Message): Message {
  try {
    // Validate message structure first
    if (!message.id || !message.role || !message.content) {
      throw new ValidationError('Invalid message structure');
    }

    // Validate role
    if (!['user', 'assistant', 'system'].includes(message.role)) {
      throw new ValidationError('Invalid message role');
    }

    const sanitizedContent = sanitizeInput(message.content);
    
    if (!validateContentSecurity(sanitizedContent)) {
      throw new ValidationError('Invalid message content');
    }

    if (sanitizedContent.length === 0) {
      throw new ValidationError('Message content cannot be empty');
    }

    return {
      ...message,
      content: sanitizedContent
    };
  } catch (error) {
    logger.error('Error processing message:', error);
    throw error instanceof ValidationError ? error : new ValidationError('Message processing failed');
  }
}

export function processMessages(messages: Message[]): Message[] {
  if (!Array.isArray(messages)) {
    throw new ValidationError('Messages must be an array');
  }
  
  if (messages.length === 0) {
    throw new ValidationError('Messages array cannot be empty');
  }

  return messages.map(processMessage);
}