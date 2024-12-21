import { describe, test, expect, beforeEach, vi } from 'vitest';
import { cache } from '../utils/cache';

describe('cache', () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('stores and retrieves values', () => {
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  test('handles cache expiration', () => {
    cache.set('key', 'value', { maxAge: 1000 });
    expect(cache.get('key')).toBe('value');
    
    vi.advanceTimersByTime(1500);
    expect(cache.get('key')).toBeNull();
  });

  test('checks existence of keys', () => {
    cache.set('key', 'value');
    expect(cache.has('key')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  test('deletes keys', () => {
    cache.set('key', 'value');
    cache.delete('key');
    expect(cache.has('key')).toBe(false);
  });

  test('clears all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.clear();
    expect(cache.has('key1')).toBe(false);
    expect(cache.has('key2')).toBe(false);
  });
});