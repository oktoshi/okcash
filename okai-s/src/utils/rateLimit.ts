interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number; // in seconds
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private limits: Map<string, RateLimitEntry> = new Map();
  
  private constructor(private config: RateLimitConfig) {}

  static getInstance(config: RateLimitConfig = { maxRequests: 50, timeWindow: 3600 }): RateLimiter {
    if (!this.instance) {
      this.instance = new RateLimiter(config);
    }
    return this.instance;
  }

  checkLimit(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now >= entry.resetTime) {
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + (this.config.timeWindow * 1000)
      });
      return true;
    }

    if (entry.count >= this.config.maxRequests) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() >= entry.resetTime) {
      return this.config.maxRequests;
    }
    return this.config.maxRequests - entry.count;
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry || Date.now() >= entry.resetTime) {
      return 0;
    }
    return entry.resetTime;
  }

  clearLimit(identifier: string) {
    this.limits.delete(identifier);
  }
}