/**
 * Security utilities for input validation and sanitization
 */
import { logger } from './logger';
import { ValidationError } from './errors';

/**
 * Sanitizes user input by removing potentially dangerous content
 */
export function sanitizeInput(input: string): string {
  try {
    // Remove HTML tags
    const withoutTags = input.replace(/<[^>]*>/g, '');
    
    // Remove dangerous keywords
    const withoutDangerousWords = withoutTags.replace(
      /script|javascript|eval|alert|vbscript|on\w+=/gi, 
      ''
    );
    
    // Replace multiple spaces with single space
    const normalized = withoutDangerousWords.replace(/\s+/g, ' ');
    
    // Remove special characters except basic punctuation and spaces
    const cleaned = normalized.replace(/[^\w\s.,!?-]/g, ' ');
    
    // Trim and normalize whitespace
    return cleaned.trim().replace(/\s+/g, ' ');
  } catch (error) {
    logger.error('Error sanitizing input:', error);
    throw new ValidationError('Input sanitization failed');
  }
}

/**
 * Validates content security
 */
export function validateContentSecurity(content: string): boolean {
  try {
    const maxLength = 4000;
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+=/i,
      /eval\(/i,
      /Function\(/i
    ];

    if (!content || content.length > maxLength) {
      return false;
    }

    return !suspiciousPatterns.some(pattern => pattern.test(content));
  } catch (error) {
    logger.error('Error validating content security:', error);
    return false;
  }
}

/**
 * Validates JWT format (without verification)
 */
export function validateToken(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
}

/**
 * Generates secure random ID
 */
export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}