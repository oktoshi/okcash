import { describe, test, expect } from 'vitest';
import { analytics } from '../utils/analytics';

describe('analytics', () => {
  test('tracks events correctly', () => {
    analytics.trackEvent('test_event', { value: 123 });
    const events = analytics.getEvents();
    expect(events).toHaveLength(1);
    expect(events[0].name).toBe('test_event');
    expect(events[0].data).toEqual({ value: 123 });
  });

  test('maintains event history limit', () => {
    analytics.clearEvents();
    for (let i = 0; i < 1100; i++) {
      analytics.trackEvent(`event_${i}`);
    }
    expect(analytics.getEvents()).toHaveLength(1000);
  });
});