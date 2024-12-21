import { describe, test, expect, beforeEach } from 'vitest';
import { analytics } from '../utils/analytics';

describe('analytics', () => {
  beforeEach(() => {
    analytics.clearEvents();
  });

  test('tracks events correctly', () => {
    analytics.trackEvent('test_event', { value: 123 });
    const events = analytics.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('test_event');
    expect(events[0].data).toEqual({ value: 123 });
  });

  test('maintains event history limit', () => {
    for (let i = 0; i < 1100; i++) {
      analytics.trackEvent(`event_${i}`);
    }
    expect(analytics.getEvents()).toHaveLength(1000);
  });

  test('includes timestamp with events', () => {
    analytics.trackEvent('test_event');
    const events = analytics.getEvents();
    expect(events[0].timestamp).toBeDefined();
    expect(typeof events[0].timestamp).toBe('number');
  });
});