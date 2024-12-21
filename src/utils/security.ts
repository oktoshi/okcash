/**
 * Security utilities for input validation and sanitization
 */
import { logger } from './logger';
import { ValidationError } from './errors';
import { removeControlCharacters } from './characterSanitizer';

/**
 * Sanitizes user input by removing potentially dangerous content
 */
export function sanitizeInput(input: string): string {
  try {
    if (!input) return '';

    // First pass: Remove dangerous HTML and scripts
    let sanitized = input;
    let previous;
    do {
      previous = sanitized;
      sanitized = sanitized
        // Remove complete script tags and their content
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        // Remove dangerous HTML event attributes
        .replace(/\son\w+\s*=\s*["'].*?["']/gi, '')
        // Remove dangerous attributes and their content
        .replace(/\s(href|src|style|formaction)\s*=\s*["'].*?["']/gi, '')
        // Remove all remaining HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove dangerous protocols
        .replace(/javascript:|data:|vbscript:|file:/gi, '');
    } while (sanitized !== previous);

    // Second pass: Multi-character sanitization
    do {
      previous = sanitized;
      sanitized = sanitized
        // Remove potential SQL injection characters
        .replace(/['";`]/g, '')
        // Remove potential command injection characters
        .replace(/[&|$><`]/g, '');
    } while (sanitized !== previous);

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