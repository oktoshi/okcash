import { TextMatchingConfig } from './textMatching';

// Helper function to register patterns for a knowledge base category
export function registerKnowledgePatterns(
  category: string,
  patterns: { pattern: RegExp; weight: number; }[],
  termWeights: { [term: string]: number }
) {
  const config = TextMatchingConfig.getInstance();
  config.addCategory(category, patterns, termWeights);
}

// Helper to extract key terms from a knowledge base
export function extractKnowledgeTerms(kb: any): string[] {
  const terms = new Set<string>();
  
  // Extract terms from topics
  if (kb.topics) {
    Object.values(kb.topics).forEach((topicList: any) => {
      if (Array.isArray(topicList)) {
        topicList.forEach(topic => {
          topic.toLowerCase().split(/\W+/).forEach(term => {
            if (term.length > 2) terms.add(term);
          });
        });
      }
    });
  }
  
  // Extract terms from Q&As
  if (kb.sampleQA) {
    Object.values(kb.sampleQA).forEach((qaList: any) => {
      if (Array.isArray(qaList)) {
        qaList.forEach(qa => {
          qa.question.toLowerCase().split(/\W+/).forEach(term => {
            if (term.length > 2) terms.add(term);
          });
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