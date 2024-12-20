import { beforeAll, afterAll, afterEach, vi } from 'vitest';

// Mock environment variables
beforeAll(() => {
  vi.stubEnv('VITE_OPENROUTER_API_KEY', 'test-key');
  vi.stubEnv('VITE_SITE_URL', 'http://localhost:5173');
  vi.stubEnv('VITE_APP_NAME', 'OKai S Test');
});

// Clear all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

// Restore environment after all tests
afterAll(() => {
  vi.unstubAllEnvs();
});