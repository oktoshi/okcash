import type { Message } from '../types';
import { sanitizeInput, validateContentSecurity } from './security';
import { ValidationError } from './errors';
import { logger } from './logger';
import { validateMessages } from './validation';

export function processMessage(message: Message): Message {
  try {
    // Pre-process message
    const processedMessage = {
      ...message,
      content: message.content.trim()
    };

    // Validate message structure first
    const [validatedMessage] = validateMessages([processedMessage]);

    // Sanitize and validate content
    const sanitizedContent = sanitizeInput(validatedMessage.content);
    
    if (!sanitizedContent || sanitizedContent.length === 0) {
      throw new ValidationError('Message content cannot be empty after sanitization');
    }

    if (!validateContentSecurity(sanitizedContent)) {
      throw new ValidationError('Invalid message content detected');
    }

    return {
      ...validatedMessage,
      content: sanitizedContent
    };
  } catch (error) {
    logger.error('Error processing message:', { error, message });
    throw error instanceof ValidationError ? error : new ValidationError('Message processing failed');
  }
}

export function processMessages(messages: Message[]): Message[] {
  try {
    // Initial array validation
    if (!Array.isArray(messages)) {
      throw new ValidationError('Messages must be an array');
    }
    
    if (messages.length === 0) {
      throw new ValidationError('Messages array cannot be empty');
    }

    if (messages.length > 100) {
      throw new ValidationError('Too many messages (maximum 100)');
    }

    // Process each message individually
    const processedMessages = messages.map(processMessage);

    // Validate the entire conversation
    return validateMessages(processedMessages);
  } catch (error) {
    logger.error('Error processing messages:', { error, messages });
    throw error instanceof ValidationError ? error : new ValidationError('Messages processing failed');
  }
}