/**
 * Security utilities for input validation and sanitization
 */
import { logger } from './logger';
import { ValidationError } from './errors';
import { removeControlCharacters } from './characterSanitizer';
import DOMPurify from 'dompurify';

/**
 * Sanitizes user input by removing potentially dangerous content
 */
export function sanitizeInput(input: string): string {
  try {
    if (!input) return '';

    // Use DOMPurify to sanitize input
    let sanitized = DOMPurify.sanitize(input);

    // Second pass: Multi-character sanitization
    sanitized = sanitized
      // Remove potential SQL injection characters
      .replace(/['";`]/g, '')
      // Remove potential command injection characters
      .replace(/[&|$><`]/g, '');

    // Remove control characters using dedicated utility
    sanitized = removeControlCharacters(sanitized);

    // Final pass: Normalize whitespace
    return sanitized.replace(/\s+/g, ' ').trim();
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
    
    // Comprehensive pattern matching for dangerous content
    const dangerousPatterns = [
      // Script injection
      /<script/i,
      /javascript:/i,
      /data:\s*\w+\/\w+\s*;/i,
      /vbscript:/i,
      /file:/i,
      
      // Event handlers
      /\bon\w+\s*=/i,
      
      // JavaScript execution
      /eval\s*\(/i,
      /Function\s*\(/i,
      /setTimeout\s*\(/i,
      /setInterval\s*\(/i,
      
      // SQL injection
      /'.*(-|#|\/\*)/i,
      /;.*DROP\s+TABLE/i,
      
      // Command injection
      /\|.*[\w\s]+/i,
      /`.*[\w\s]+`/i,
      
      // Base64 data (potential obfuscation)
      /base64.*[A-Za-z0-9+/=]{20,}/i
    ];

    if (!content || content.length > maxLength) {
      return false;
    }

    // Check for any dangerous patterns
    return !dangerousPatterns.some(pattern => pattern.test(content));
  } catch (error) {
    logger.error('Error validating content security:', error);
    return false;
  }
}