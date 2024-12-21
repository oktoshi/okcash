import { describe, test, expect, beforeEach } from 'vitest';
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
    const now = Date.now();
    const futureTime = now + 1500;
    
    cache.set('key', 'value', { maxAge: 1000 });
    expect(cache.get('key')).toBe('value');
    
    // Simulate time passing
    Date.now = () => futureTime;
    expect(cache.get('key')).toBeNull();
    
    // Restore Date.now
    Date.now = () => now;
  });

  test('checks existence of keys', () => {
    cache.set('key', 'value');
    expect(cache.has('key')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });
});