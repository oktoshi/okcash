import { useState, useCallback, useMemo } from 'react';
import { personas } from '../config/personas';
import { knowledgeBases } from '../config/knowledge';
import type { AIPersona } from '../config/personas/types';

export function usePersona() {
  const [currentPersona, setCurrentPersona] = useState<AIPersona>(personas.default);

  // Combine all knowledge for the current persona
  const currentKnowledge = useMemo(() => {
    const allTopics: string[] = [];
    
    // Add topics from each referenced knowledge base
    currentPersona.knowledgeBases?.forEach(baseName => {
      const base = knowledgeBases[baseName];
      if (base) {
        Object.values(base.topics).forEach(topics => {
          allTopics.push(...topics);
        });
      }
    });
    
    // Add custom knowledge if any
    if (currentPersona.customKnowledge) {
      allTopics.push(...currentPersona.customKnowledge);
    }
    
    return allTopics;
  }, [currentPersona]);

  const changePersona = useCallback((personaKey: string) => {
    const newPersona = personas[personaKey];
    if (newPersona) {
      setCurrentPersona(newPersona);
    }
  }, []);

  const sortedPersonaKeys = useMemo(() => {
    return Object.entries(personas)
      .filter(([key]) => key !== 'default')
      .sort(([keyA, a], [keyB, b]) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        return a.name.localeCompare(b.name);
      })
      .map(([key]) => key);
  }, []);

  return {
    currentPersona,
    currentKnowledge,
    changePersona,
    availablePersonas: sortedPersonaKeys
  };
}