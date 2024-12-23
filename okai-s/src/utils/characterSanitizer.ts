/**
 * Character sanitization utilities
 */

// Safe character ranges (printable ASCII and common Unicode)
const SAFE_RANGES = [
  [0x20, 0x7E], // Printable ASCII
  [0xA0, 0xD7FF], // Latin-1 Supplement to end of Basic Multilingual Plane
  [0xF900, 0xFDCF], // CJK Compatibility Ideographs
  [0xFDF0, 0xFFFD], // Arabic Presentation Forms-A
] as const;

/**
 * Checks if a character code is within safe ranges
 */
export function isCharacterSafe(code: number): boolean {
  return SAFE_RANGES.some(([min, max]) => code >= min && code <= max);
}

/**
 * Removes unsafe control characters from text
 */
export function removeControlCharacters(text: string): string {
  return Array.from(text)
    .filter(char => isCharacterSafe(char.codePointAt(0) || 0))
    .join('');
}