interface PerformanceMetric {
  name: string;
  startTime: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  startMetric(name: string, metadata?: Record<string, unknown>) {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
      metadata
    });
  }

  endMetric(name: string) {
    const metric = this.metrics.get(name);
    if (metric) {
      metric.duration = performance.now() - metric.startTime;
      return metric;
    }
    return null;
  }

  getMetric(name: string) {
    return this.metrics.get(name);
  }

  getAllMetrics() {
    return Array.from(this.metrics.values());
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const monitor = PerformanceMonitor.getInstance();