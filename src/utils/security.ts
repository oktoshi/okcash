import { ValidationError } from './errors';
import { logger } from './logger';

/**
 * Sanitizes user input by removing potentially dangerous content
 */
export function sanitizeInput(input: string): string {
  try {
    // Remove HTML tags
    const withoutTags = input.replace(/<[^>]*>/g, '');
    
    // Replace multiple spaces with single space
    const normalized = withoutTags.replace(/\s+/g, ' ');
    
    // Remove dangerous keywords
    const withoutDangerousWords = normalized.replace(
      /script|javascript|eval|alert|vbscript|on\w+=/gi, 
      ''
    );
    
    // Remove special characters but keep basic punctuation
    return withoutDangerousWords.replace(/[^\w\s.,!?-]/g, ' ').trim();
  } catch (error) {
    logger.error('Error sanitizing input:', error);
    throw new ValidationError('Input sanitization failed');
  }
}

/**
 * Validates content security by checking for dangerous patterns
 */
export function validateContentSecurity(content: string): boolean {
  const maxLength = 4000;
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+=/i,
    /eval\(/i,
    /Function\(/i,
    /setTimeout\(/i,
    /setInterval\(/i,
    /new\s+Function/i,
    /import\(/i,
    /require\(/i
  ];

  if (content.length > maxLength) {
    throw new ValidationError('Content exceeds maximum length');
  }

  return !suspiciousPatterns.some(pattern => pattern.test(content));
}

/**
 * Validates JWT token format
 */
export function validateToken(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
}

/**
 * Generates a cryptographically secure random ID
 */
export function generateSecureId(length: number = 32): string {
  try {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    logger.error('Error generating secure ID:', error);
    throw new Error('Failed to generate secure ID');
  }
}

/**
 * Validates content type against allowed types
 */
export function validateContentType(type: string): boolean {
  const allowedTypes = [
    'text/plain',
    'application/json',
    'text/markdown'
  ];
  return allowedTypes.includes(type);
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates a hash of the provided data
 */
export async function generateHash(data: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    logger.error('Error generating hash:', error);
    throw new Error('Failed to generate hash');
  }
}