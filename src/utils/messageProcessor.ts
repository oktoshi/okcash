import type { Message } from '../types';
import { sanitizeInput, validateContentSecurity } from './security';
import { ValidationError } from './errors';
import { logger } from './logger';
import { validateMessages } from './validation';

export function processMessage(message: Message): Message {
  try {
    // Validate message structure
    validateMessages([message]);

    // Sanitize and validate content
    const sanitizedContent = sanitizeInput(message.content);
    
    if (!validateContentSecurity(sanitizedContent)) {
      throw new ValidationError('Invalid message content');
    }

    if (sanitizedContent.length === 0) {
      throw new ValidationError('Message content cannot be empty after sanitization');
    }

    if (sanitizedContent.length > 4000) {
      throw new ValidationError('Message content exceeds maximum length');
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
  try {
    // Validate array structure
    if (!Array.isArray(messages)) {
      throw new ValidationError('Messages must be an array');
    }
    
    if (messages.length === 0) {
      throw new ValidationError('Messages array cannot be empty');
    }

    if (messages.length > 100) {
      throw new ValidationError('Too many messages');
    }

    // Process each message
    return messages.map(processMessage);
  } catch (error) {
    logger.error('Error processing messages:', error);
    throw error instanceof ValidationError ? error : new ValidationError('Messages processing failed');
  }
}