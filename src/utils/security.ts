/**
 * Security utilities for browser environment
 * Uses Web Crypto API instead of Node.js crypto module
 */

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
    .trim();
}

// Content security validation
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

// Generate secure hash using Web Crypto API
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Validate JWT format (without verification)
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

// Generate secure random string
export function generateSecureId(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Content type validation
export function validateContentType(type: string): boolean {
  const allowedTypes = [
    'text/plain',
    'application/json',
    'text/markdown'
  ];
  return allowedTypes.includes(type);
}

// XSS prevention
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}