import { createHash } from 'crypto';

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim();
}

// Content security
export function validateContentSecurity(content: string): boolean {
  const maxLength = 4000;
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+=/i
  ];

  if (content.length > maxLength) {
    return false;
  }

  return !suspiciousPatterns.some(pattern => pattern.test(content));
}

// Hash sensitive data
export function hashData(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}

// Token validation
export function validateToken(token: string): boolean {
  return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
}

// Safe JSON parse
export function safeJSONParse(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}