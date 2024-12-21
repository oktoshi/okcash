import { describe, test, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import { metrics } from '../utils/metrics';
import { analytics } from '../utils/analytics';
import { RateLimiter } from '../utils/rateLimit';

// Mock all dependencies
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');
vi.mock('../utils/cache');

// Mock OpenAI
vi.mock('openai', () => ({
  default: class MockOpenAI {
    chat = {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{
            message: {
              content: 'Test response'
            }
          }]
        })
      }
    }
  }
}));

describe('sendMessage', () => {
  const testPersona = personas.okai;
  const testMessages = [
    { id: '1', role: 'user' as const, content: 'Hello' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    RateLimiter.getInstance({ maxRequests: 50, timeWindow: 3600 });
    vi.spyOn(RateLimiter.prototype, 'checkLimit').mockReturnValue(true);
  });

  test('sends message and returns response', async () => {
    const response = await sendMessage(testMessages, testPersona);
    expect(response).toBeDefined();
    expect(metrics.recordMetric).toHaveBeenCalledWith('message_request_start', 1);
    expect(analytics.trackEvent).toHaveBeenCalledWith('message_sent', expect.objectContaining({
      persona: testPersona.name,
      requestId: expect.any(String)
    }));
  });

  // Rest of the tests...
});