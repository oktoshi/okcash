import { describe, test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKnowledgeReload } from '../../hooks/useKnowledgeReload';

describe('useKnowledgeReload', () => {
  const mockReload = vi.fn();
  const mockOn = vi.fn();
  const mockOff = vi.fn();
  const mockGlob = vi.fn(() => ({}));

  beforeEach(() => {
    vi.resetModules();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    mockOn.mockClear();
    mockOff.mockClear();
    mockReload.mockClear();
    mockGlob.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('sets up hot reload listener', () => {
    const mockHot = {
      on: mockOn,
      off: mockOff
    };

    vi.stubGlobal('import.meta', { 
      hot: mockHot,
      glob: mockGlob
    });

    const { unmount } = renderHook(() => useKnowledgeReload());
    
    expect(mockOn).toHaveBeenCalledWith(
      'vite:beforeUpdate',
      expect.any(Function)
    );

    // Trigger update handler
    const updateHandler = mockOn.mock.calls[0][1];
    updateHandler();

    expect(mockReload).toHaveBeenCalled();

    unmount();
  });

  test('handles missing hot reload', () => {
    vi.stubGlobal('import.meta', {
      glob: mockGlob
    });

    expect(() => {
      renderHook(() => useKnowledgeReload());
    }).not.toThrow();
  });

  test('cleans up on unmount', () => {
    const mockHot = {
      on: mockOn,
      off: mockOff
    };

    vi.stubGlobal('import.meta', { 
      hot: mockHot,
      glob: mockGlob
    });

    const { unmount } = renderHook(() => useKnowledgeReload());
    unmount();

    expect(mockOff).toHaveBeenCalledWith(
      'vite:beforeUpdate',
      expect.any(Function)
    );
  });
});