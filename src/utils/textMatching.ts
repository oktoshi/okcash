import { logger } from './logger';

interface Pattern {
  pattern: RegExp;
  weight: number;
}

interface TermWeight {
  [term: string]: number;
}

// Common English stop words
const stopWords = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'do', 'for', 'from', 'has',
  'he', 'how', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was',
  'were', 'what', 'when', 'where', 'who', 'will', 'with'
]);

export class TextMatchingConfig {
  private static instance: TextMatchingConfig;
  private patternConfigs: Map<string, Pattern[]> = new Map();
  private termWeightConfigs: Map<string, TermWeight> = new Map();

  private constructor() {}

  static getInstance(): TextMatchingConfig {
    if (!this.instance) {
      this.instance = new TextMatchingConfig();
    }
    return this.instance;
  }

  addCategory(category: string, patterns: Pattern[], termWeights: TermWeight) {
    this.patternConfigs.set(category, patterns);
    this.termWeightConfigs.set(category, termWeights);
    logger.debug('Added patterns for category', { category, patterns });
  }

  getPatterns(category: string): Pattern[] {
    return this.patternConfigs.get(category) || [];
  }

  getTermWeights(category: string): TermWeight {
    return this.termWeightConfigs.get(category) || {};
  }
}

// Extract key terms from text
export function extractKeyTerms(text: string): string[] {
  const normalized = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove special characters
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();

  return normalized
    .split(/\s+/)
    .filter(term => term.length > 1 && !stopWords.has(term))
    .map(term => term.toLowerCase());
}

// Calculate similarity between two strings
export function calculateSimilarity(str1: string, str2: string, category?: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  const terms1 = extractKeyTerms(s1);
  const terms2 = extractKeyTerms(s2);
  
  const termOverlap = calculateTermOverlap(terms1, terms2, category);
  const intentScore = calculateIntentMatch(s1, s2, category);
  
  return Math.min(1, termOverlap + intentScore);
}

// Private helper functions
function calculateTermOverlap(terms1: string[], terms2: string[], category?: string): number {
  const config = TextMatchingConfig.getInstance();
  let matchCount = 0;
  let totalWeight = 0;
  
  const termWeights = category ? 
    config.getTermWeights(category) : 
    { default: 0.1 };
  
  for (const term1 of terms1) {
    const weight = termWeights[term1] || termWeights.default || 0.1;
    totalWeight += weight;
    
    for (const term2 of terms2) {
      if (term1 === term2 || 
          term1.includes(term2) || 
          term2.includes(term1) ||
          levenshteinDistance(term1, term2) <= 2) {
        matchCount += weight;
        break;
      }
    }
  }
  
  return totalWeight > 0 ? matchCount / totalWeight : 0;
}

function calculateIntentMatch(s1: string, s2: string, category?: string): number {
  const config = TextMatchingConfig.getInstance();
  const patterns = category ? config.getPatterns(category) : [];
  
  let score = 0;
  for (const { pattern, weight } of patterns) {
    if (pattern.test(s1) && pattern.test(s2)) {
      score += weight;
    }
  }
  
  return Math.min(0.6, score);
}

function levenshteinDistance(s1: string, s2: string): number {
  if (s1.length < s2.length) [s1, s2] = [s2, s1];
  
  const row = Array(s2.length + 1).fill(0);
  for (let i = 0; i <= s2.length; i++) row[i] = i;
  
  for (let i = 1; i <= s1.length; i++) {
    let prev = i;
    for (let j = 1; j <= s2.length; j++) {
      const val = Math.min(
        prev + 1,
        row[j] + 1,
        row[j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1)
      );
      row[j - 1] = prev;
      prev = val;
    }
    row[s2.length] = prev;
  }
  
  return row[s2.length];
}

export const textMatchingConfig = TextMatchingConfig.getInstance();