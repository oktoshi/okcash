import { afterAll, afterEach, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom/vitest';

// Add type support for testing-library jest-dom
declare module 'vitest' {
  interface Assertion<T> {
    toBeInTheDocument(): T;
    toHaveStyle(style: Record<string, string>): T;
    toHaveValue(value: string | number): T;
    toBeDisabled(): T;
    toHaveClass(className: string): T;
  }
}

// Mock Web APIs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => {
  setTimeout(cb, 0);
  return 0;
});

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn()
} as unknown as Performance;

// Mock crypto API
const mockCrypto = {
  subtle: {
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
  },
  getRandomValues: vi.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }),
  randomUUID: vi.fn(() => 'test-uuid')
} as unknown as Crypto;

Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
  writable: true,
  configurable: true,
  enumerable: true
});

// Mock import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    MODE: 'test',
    VITE_OPENROUTER_API_KEY: 'test-key',
    VITE_SITE_URL: 'http://localhost:5173',
    VITE_APP_NAME: 'OKai S Test'
  },
  hot: {
    on: vi.fn(),
    off: vi.fn()
  }
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
});

// Restore environment after all tests
afterAll(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});