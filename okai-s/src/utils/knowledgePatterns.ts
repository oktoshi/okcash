import { TextMatchingConfig } from './textMatching';

interface Pattern {
  pattern: RegExp;
  weight: number;
}

interface TermWeight {
  [term: string]: number;
}

// Helper function to register patterns for a knowledge base category
export function registerKnowledgePatterns(
  category: string,
  patterns: Pattern[],
  termWeights: TermWeight
) {
  const config = TextMatchingConfig.getInstance();
  config.addCategory(category, patterns, termWeights);
}

// Helper to extract key terms from a knowledge base
export function extractKnowledgeTerms(kb: Record<string, unknown>): string[] {
  const terms = new Set<string>();
  
  // Extract terms from topics
  if (kb.topics && typeof kb.topics === 'object') {
    Object.values(kb.topics).forEach((topicList) => {
      if (Array.isArray(topicList)) {
        topicList.forEach(topic => {
          if (typeof topic === 'string') {
            topic.toLowerCase().split(/\W+/).forEach(term => {
              if (term.length > 2) terms.add(term);
            });
          }
        });
      }
    });
  }
  
  return Array.from(terms);
}

// Helper to generate patterns from Q&As
export function generateQAPatterns(qa: { question: string; answer: string }): RegExp[] {
  const question = qa.question.toLowerCase();
  const words = question.split(/\W+/).filter(w => w.length > 2);
  
  const patterns: RegExp[] = [];
  
  // Generate patterns based on question structure
  if (question.startsWith('how')) {
    patterns.push(new RegExp(`how (?:can|do|to) .* ${words.slice(-1)[0]}`, 'i'));
  }
  
  if (question.includes('what')) {
    patterns.push(new RegExp(`what .* ${words.slice(-2).join(' ')}`, 'i'));
  }
  
  // Add exact match pattern
  patterns.push(new RegExp(words.join('.*'), 'i'));
  
  return patterns;
}