/**
 * Text matching utilities for finding similar content
 */

// Common English stop words
const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
  'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
  'that', 'the', 'to', 'was', 'were', 'will', 'with'
]);

/**
 * Calculate similarity between two strings
 */
export function calculateSimilarity(str1: string, str2: string): number {
  const terms1 = extractKeyTerms(str1);
  const terms2 = extractKeyTerms(str2);
  
  if (terms1.length === 0 || terms2.length === 0) return 0;

  const intersection = terms1.filter(term => terms2.includes(term));
  const union = Array.from(new Set([...terms1, ...terms2]));

  return intersection.length / union.length;
}

/**
 * Extract key terms from text for comparison
 */
export function extractKeyTerms(text: string): string[] {
  if (!text) return [];

  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();

  return normalized
    .split(/\s+/)
    .filter(term => term.length > 1 && !stopWords.has(term))
    .map(term => term.toLowerCase());
}