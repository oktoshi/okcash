import { describe, test, expect } from 'vitest';
import { metrics } from '../utils/metrics';

describe('metrics', () => {
  beforeEach(() => {
    metrics.clearMetrics();
  });

  test('records metrics correctly', () => {
    metrics.recordMetric('test_metric', 123, { label: 'test' });
    const points = metrics.getMetric('test_metric');
    expect(points).toHaveLength(1);
    expect(points[0].value).toBe(123);
    expect(points[0].labels).toEqual({ label: 'test' });
  });

  test('maintains metric history limit', () => {
    for (let i = 0; i < 1100; i++) {
      metrics.recordMetric('test_metric', i);
    }
    expect(metrics.getMetric('test_metric')).toHaveLength(1000);
  });
});