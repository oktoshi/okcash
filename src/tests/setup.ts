import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom/vitest';

// Add type support for jest-dom
declare module 'vitest' {
  interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
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
global.crypto = {
  subtle: {
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
  },
  getRandomValues: vi.fn().mockImplementation((arr) => {
    return arr.map(() => Math.floor(Math.random() * 256));
  }),
  randomUUID: vi.fn(() => 'test-uuid')
} as unknown as Crypto;

// Mock environment variables
beforeAll(() => {
  vi.stubEnv('VITE_OPENROUTER_API_KEY', 'test-key');
  vi.stubEnv('VITE_SITE_URL', 'http://localhost:5173');
  vi.stubEnv('VITE_APP_NAME', 'OKai S Test');
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

// Restore environment after all tests
afterAll(() => {
  vi.unstubAllEnvs();
});