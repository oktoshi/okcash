import type { AIPersona } from '../config/personas/types';
import type { KnowledgeBase } from '../config/knowledge/types';
import { knowledgeBases } from '../config/knowledge';

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

export async function integrateKnowledge(persona: AIPersona): Promise<IntegratedKnowledge> {
  const integrated: IntegratedKnowledge = {
    topics: [],
    prompts: [],
    qa: []
  };

  // Add persona's custom knowledge
  if (persona.customKnowledge) {
    integrated.topics.push(...persona.customKnowledge);
  }

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

  return integrated;
}