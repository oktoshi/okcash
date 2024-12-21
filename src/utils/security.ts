import { ValidationError } from './errors';

export function sanitizeInput(input: string): string {
  // Remove HTML tags and escape sequences
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Replace multiple spaces with single space
  const normalized = withoutTags.replace(/\s+/g, ' ');
  
  // Remove special characters but keep basic punctuation
  return normalized.replace(/[^\w\s.,!?-]/g, ' ').trim();
}

export function validateContentSecurity(content: string): boolean {
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

  if (content.length > maxLength) {
    return false;
  }

  return !suspiciousPatterns.some(pattern => pattern.test(content));
}

export function validateToken(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
}

export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length / 2);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}