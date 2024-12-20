import { describe, test, expect, vi } from 'vitest';
import { cache } from '../utils/cache';

describe('cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  test('stores and retrieves values', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  test('handles cache expiration', () => {
    vi.useFakeTimers();
    cache.set('key', 'value', { maxAge: 1000 });
    
    expect(cache.get('key')).toBe('value');
    
    vi.advanceTimersByTime(1500);
    expect(cache.get('key')).toBeNull();
    
    vi.useRealTimers();
  });

  test('checks existence of keys', () => {
    cache.set('key', 'value');
    expect(cache.has('key')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });
});