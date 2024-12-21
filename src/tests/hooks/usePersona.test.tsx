import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePersona } from '../../hooks/usePersona';
import { personas } from '../../config/personas';
import { knowledgeBases } from '../../config/knowledge';

describe('usePersona', () => {
  test('initializes with default persona', () => {
    const { result } = renderHook(() => usePersona());
    expect(result.current.currentPersona).toBe(personas.default);
  });

  test('changes persona', () => {
    const { result } = renderHook(() => usePersona());
    
    act(() => {
      result.current.changePersona('elonMusk');
    });

    expect(result.current.currentPersona).toBe(personas.elonmusk);
  });

  test('provides sorted persona list', () => {
    const { result } = renderHook(() => usePersona());
    const personaList = result.current.availablePersonas;
    
    expect(Array.isArray(personaList)).toBe(true);
    expect(personaList.length).toBeGreaterThan(0);
    
    // Check sorting by displayOrder
    const orderedPersonas = personaList.map(key => personas[key]);
    for (let i = 1; i < orderedPersonas.length; i++) {
      const prev = orderedPersonas[i - 1].displayOrder ?? Infinity;
      const curr = orderedPersonas[i].displayOrder ?? Infinity;
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });

  test('integrates knowledge bases', () => {
    const { result } = renderHook(() => usePersona());
    const knowledge = result.current.currentKnowledge;
    
    expect(Array.isArray(knowledge)).toBe(true);
    
    // Check custom knowledge
    const customKnowledge = personas.default.customKnowledge || [];
    expect(knowledge).toEqual(expect.arrayContaining(customKnowledge));
    
    // Check knowledge base topics
    personas.default.knowledgeBases?.forEach(baseName => {
      const base = knowledgeBases[baseName];
      if (base) {
        Object.values(base.topics).flat().forEach(topic => {
          expect(knowledge).toContain(topic);
        });
      }
    });
  });

  test('handles invalid persona key', () => {
    const { result } = renderHook(() => usePersona());
    const initialPersona = result.current.currentPersona;
    
    act(() => {
      result.current.changePersona('nonexistent');
    });

    expect(result.current.currentPersona).toBe(initialPersona);
  });

  test('maintains persona state', () => {
    const { result, rerender } = renderHook(() => usePersona());
    
    act(() => {
      result.current.changePersona('elonMusk');
    });
    
    rerender();
    expect(result.current.currentPersona).toBe(personas.elonmusk);
  });
});