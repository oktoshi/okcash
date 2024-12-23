import { describe, test, expect, beforeEach } from 'vitest';
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

  test('includes timestamp with metrics', () => {
    metrics.recordMetric('test_metric', 123);
    const points = metrics.getMetric('test_metric');
    expect(points[0].timestamp).toBeDefined();
    expect(typeof points[0].timestamp).toBe('number');
  });

  test('handles multiple metrics', () => {
    metrics.recordMetric('metric1', 1);
    metrics.recordMetric('metric2', 2);
    const allMetrics = metrics.getAllMetrics();
    expect(allMetrics.size).toBe(2);
  });
});