```typescript
import { afterAll, afterEach, vi } from 'vitest';
import { TextEncoder, TextDecoder } from 'util';
import '@testing-library/jest-dom/vitest';

// Mock environment variables
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

// Mock Web APIs
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

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

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Restore environment after all tests
afterAll(() => {
  vi.unstubAllEnvs();
});
```