// Types for pattern configuration
interface PatternConfig {
  pattern: RegExp;
  weight: number;
}

interface TermWeights {
  [term: string]: number;
}

// Configuration store for dynamic patterns and weights
export class TextMatchingConfig {
  private static instance: TextMatchingConfig;
  private patternConfigs: Map<string, PatternConfig[]> = new Map();
  private termWeightConfigs: Map<string, TermWeights> = new Map();

  private constructor() {}

  static getInstance(): TextMatchingConfig {
    if (!this.instance) {
      this.instance = new TextMatchingConfig();
    }
    return this.instance;
  }

  addCategory(category: string, patterns: PatternConfig[], termWeights: TermWeights) {
    this.patternConfigs.set(category, patterns);
    this.termWeightConfigs.set(category, termWeights);
  }

  getPatterns(category: string): PatternConfig[] {
    return this.patternConfigs.get(category) || [];
  }

  getTermWeights(category: string): TermWeights {
    return this.termWeightConfigs.get(category) || {};
  }
}

// Initialize with default patterns for backward compatibility
const config = TextMatchingConfig.getInstance();
config.addCategory('staking', [
  { pattern: /how (?:can|do|to) .* stake/i, weight: 0.4 },
  { pattern: /(?:help|start|begin) .* stake/i, weight: 0.4 },
  { pattern: /stake .* ok(?:cash)?/i, weight: 0.4 },
  { pattern: /want to stake/i, weight: 0.3 },
  { pattern: /staking .* ok(?:cash)?/i, weight: 0.4 }
], {
  stake: 0.4,
  ok: 0.4,
  okcash: 0.4,
  help: 0.2,
  start: 0.2,
  how: 0.2
});

// Calculates similarity score between two strings with category context
export function calculateSimilarity(str1: string, str2: string, category?: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);
  
  const terms1 = extractKeyTerms(s1);
  const terms2 = extractKeyTerms(s2);
  
  const termOverlap = calculateTermOverlap(terms1, terms2, category);
  const intentScore = calculateIntentMatch(s1, s2, category);
  
  return Math.min(1, termOverlap + intentScore);
}

function calculateTermOverlap(terms1: string[], terms2: string[], category?: string): number {
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
  const patterns = category ? 
    config.getPatterns(category) : 
    [];
  
  let score = 0;
  for (const { pattern, weight } of patterns) {
    if (pattern.test(s1) && pattern.test(s2)) {
      score += weight;
    }
  }
  
  return Math.min(0.6, score);
}

// Normalize text for consistent matching
function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/[.,?!]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract key terms from text
export function extractKeyTerms(text: string): string[] {
  const normalized = normalizeText(text);
  return normalized
    .split(/\s+/)
    .filter(term => term.length > 1 && !stopWords.has(term));
}

// Calculate Levenshtein distance for fuzzy matching
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

// Common stop words to filter out
const stopWords = new Set([/* ... existing stop words ... */]);