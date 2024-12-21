import type { AIPersona } from '../config/personas/types';
import { knowledgeBases } from '../config/knowledge';
import { calculateSimilarity } from './textMatching';
import { cache } from './cache';
import { logger } from './logger';

interface IntegratedKnowledge {
  topics: string[];
  prompts: string[];
  qa: {
    question: string;
    answer: string;
    category: string;
    source: string;
  }[];
}

interface QAMatch {
  question: string;
  answer: string;
  category: string;
  source: string;
  similarity: number;
}

export async function findBestMatch(message: string, persona: AIPersona): Promise<QAMatch | null> {
  try {
    const cacheKey = `match:${message}:${persona.name}`;
    const cached = cache.get<QAMatch>(cacheKey);
    if (cached) return cached;

    const integrated = await integrateKnowledge(persona);
    let bestMatch: QAMatch | null = null;
    let highestSimilarity = 0;

    for (const qa of integrated.qa) {
      const similarity = calculateSimilarity(message, qa.question);
      if (similarity > highestSimilarity && similarity > 0.25) {
        bestMatch = { ...qa, similarity };
        highestSimilarity = similarity;
      }
    }

    if (bestMatch) {
      cache.set(cacheKey, bestMatch, { maxAge: 3600000 }); // 1 hour
    }
    
    return bestMatch;
  } catch (error) {
    logger.error('Error finding best match:', error);
    throw error;
  }
}

export async function integrateKnowledge(persona: AIPersona): Promise<IntegratedKnowledge> {
  const cacheKey = `knowledge:${persona.name}`;
  const cached = cache.get<IntegratedKnowledge>(cacheKey);
  if (cached) return cached;

  const integrated: IntegratedKnowledge = {
    topics: [...(persona.customKnowledge || [])],
    prompts: [],
    qa: []
  };

  // Integrate knowledge bases
  persona.knowledgeBases?.forEach(baseName => {
    const kb = knowledgeBases[baseName];
    if (!kb) return;

    // Add topics
    Object.values(kb.topics).forEach(topicList => {
      integrated.topics.push(...topicList);
    });

    // Add prompts
    Object.values(kb.prompts).forEach(prompt => {
      integrated.prompts.push(prompt);
    });

    // Add Q&As
    if (kb.sampleQA) {
      Object.entries(kb.sampleQA).forEach(([category, qaList]) => {
        qaList.forEach(qa => {
          integrated.qa.push({
            ...qa,
            category,
            source: kb.name
          });
        });
      });
    }
  });

  // Deduplicate topics
  integrated.topics = Array.from(new Set(integrated.topics));

  cache.set(cacheKey, integrated, { maxAge: 3600000 }); // 1 hour
  return integrated;
}