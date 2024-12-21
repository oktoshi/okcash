```typescript
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
      result.current.changePersona('elonmusk');
    });

    expect(result.current.currentPersona).toBe(personas.elonmusk);
  });

  test('maintains persona state', () => {
    const { result, rerender } = renderHook(() => usePersona());
    
    act(() => {
      result.current.changePersona('elonmusk');
    });
    
    rerender();
    expect(result.current.currentPersona).toBe(personas.elonmusk);
  });

  test('integrates knowledge bases', () => {
    const { result } = renderHook(() => usePersona());
    const knowledge = result.current.currentKnowledge;
    
    expect(Array.isArray(knowledge)).toBe(true);
    
    // Check custom knowledge
    const customKnowledge = personas.default.customKnowledge || [];
    expect(knowledge).toEqual(expect.arrayContaining(customKnowledge));
  });
});
```