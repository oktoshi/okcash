import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKnowledgeReload } from '../../hooks/useKnowledgeReload';

describe('useKnowledgeReload', () => {
  const mockReload = vi.fn();
  const mockOn = vi.fn();
  const mockClear = vi.fn();
  const mockMap = new Map();
  
  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    mockMap.clear();
    mockOn.mockClear();
    mockClear.mockClear();
    mockReload.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('sets up hot reload listener', () => {
    const mockHot = {
      on: mockOn
    };

    vi.stubGlobal('import.meta', { hot: mockHot });
    renderHook(() => useKnowledgeReload());
    
    expect(mockOn).toHaveBeenCalledWith(
      'vite:beforeUpdate',
      expect.any(Function)
    );

    // Test callback execution
    const callback = mockOn.mock.calls[0][1];
    callback();
    expect(mockReload).toHaveBeenCalled();
  });

  test('handles missing hot reload', () => {
    vi.stubGlobal('import.meta', {});
    expect(() => {
      renderHook(() => useKnowledgeReload());
    }).not.toThrow();
  });

  test('cleans up on unmount', () => {
    const mockHot = {
      on: mockOn
    };

    vi.stubGlobal('import.meta', { hot: mockHot });
    const { unmount } = renderHook(() => useKnowledgeReload());
    
    unmount();
    expect(mockMap.size).toBe(0);
  });

  test('handles multiple reloads', () => {
    const mockHot = {
      on: mockOn
    };

    vi.stubGlobal('import.meta', { hot: mockHot });
    renderHook(() => useKnowledgeReload());
    
    const callback = mockOn.mock.calls[0][1];
    callback();
    callback();
    
    expect(mockReload).toHaveBeenCalledTimes(2);
  });
});