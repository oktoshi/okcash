import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom/vitest';

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
const mockCrypto = {
  subtle: {
    digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
  },
  getRandomValues: (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  },
  randomUUID: () => 'test-uuid'
} as unknown as Crypto;

Object.defineProperty(window, 'crypto', {
  value: mockCrypto,
  writable: true
});

// Mock environment variables
beforeAll(() => {
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
    },
    glob: () => ({})
  });
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Restore environment after all tests
afterAll(() => {
  vi.unstubAllEnvs();
});