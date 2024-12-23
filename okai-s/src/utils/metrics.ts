import { logger } from './logger';

interface MetricPoint {
  value: number;
  timestamp: number;
  labels?: Record<string, string>;
}

class Metrics {
  private static instance: Metrics;
  private metrics = new Map<string, MetricPoint[]>();
  private readonly maxPoints = 1000;

  private constructor() {}

  static getInstance(): Metrics {
    if (!this.instance) {
      this.instance = new Metrics();
    }
    return this.instance;
  }

  recordMetric(name: string, value: number, labels?: Record<string, string>) {
    const point: MetricPoint = {
      value,
      timestamp: Date.now(),
      labels
    };

    const points = this.metrics.get(name) || [];
    points.push(point);

    if (points.length > this.maxPoints) {
      points.shift();
    }

    this.metrics.set(name, points);
    logger.debug('Metric recorded', { name, point });
  }

  getMetric(name: string): MetricPoint[] {
    return this.metrics.get(name) || [];
  }

  getAllMetrics(): Map<string, MetricPoint[]> {
    return new Map(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const metrics = Metrics.getInstance();