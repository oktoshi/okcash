import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKnowledgeReload } from '../../hooks/useKnowledgeReload';

describe('useKnowledgeReload', () => {
  const mockReload = vi.fn();
  const mockOn = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    mockOn.mockClear();
    mockReload.mockClear();
  });

  test('sets up hot reload listener', () => {
    const mockHot = {
      on: mockOn
    };

    vi.stubGlobal('import.meta', { 
      ...import.meta,
      hot: mockHot,
      glob: () => ({})
    });

    renderHook(() => useKnowledgeReload());
    
    expect(mockOn).toHaveBeenCalledWith(
      'vite:beforeUpdate',
      expect.any(Function)
    );
  });

  test('handles missing hot reload', () => {
    vi.stubGlobal('import.meta', {
      ...import.meta,
      glob: () => ({})
    });

    expect(() => {
      renderHook(() => useKnowledgeReload());
    }).not.toThrow();
  });

  test('reloads on knowledge base changes', () => {
    const mockHot = {
      on: mockOn
    };

    vi.stubGlobal('import.meta', { 
      ...import.meta,
      hot: mockHot,
      glob: () => ({})
    });

    renderHook(() => useKnowledgeReload());
    
    const callback = mockOn.mock.calls[0][1];
    callback();
    
    expect(mockReload).toHaveBeenCalled();
  });
});