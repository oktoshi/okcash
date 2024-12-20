interface CacheOptions {
  maxAge?: number; // milliseconds
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  maxAge?: number;
}

class Cache {
  private static instance: Cache;
  private store = new Map<string, CacheEntry<unknown>>();

  private constructor() {}

  static getInstance(): Cache {
    if (!this.instance) {
      this.instance = new Cache();
    }
    return this.instance;
  }

  set<T>(key: string, value: T, options: CacheOptions = {}) {
    this.store.set(key, {
      value,
      timestamp: Date.now(),
      maxAge: options.maxAge
    });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key) as CacheEntry<T>;
    
    if (!entry) return null;

    if (entry.maxAge && Date.now() - entry.timestamp > entry.maxAge) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const cache = Cache.getInstance();