import { useEffect } from 'react';
import { knowledgeBases } from '../config/knowledge';
import { registerKnowledgePatterns, extractKnowledgeTerms, generateQAPatterns } from '../utils/knowledgePatterns';

export function useKnowledgeBase() {
  useEffect(() => {
    // Process each knowledge base
    Object.entries(knowledgeBases).forEach(([name, kb]) => {
      if (kb.sampleQA) {
        // Process each category in the knowledge base
        Object.entries(kb.sampleQA).forEach(([category, qaList]) => {
          const terms = extractKnowledgeTerms(kb);
          
          // Create term weights
          const termWeights = terms.reduce((acc, term) => {
            acc[term] = 0.3; // Base weight for domain-specific terms
            return acc;
          }, {} as Record<string, number>);
          
          // Generate patterns from Q&As
          const patterns = qaList.flatMap(qa => 
            generateQAPatterns(qa).map(pattern => ({
              pattern,
              weight: 0.4
            }))
          );
          
          // Register patterns and weights for this category
          registerKnowledgePatterns(
            `${name}_${category}`,
            patterns,
            termWeights
          );
        });
      }
    });
  }, []);
}