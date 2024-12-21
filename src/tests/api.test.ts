import { describe, test, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';
import { analytics } from '../utils/analytics';
import { RateLimiter } from '../utils/rateLimit';
import { ValidationError } from '../utils/errors';

// Mock all dependencies
vi.mock('../utils/logger');
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
    // Initialize RateLimiter instance
    RateLimiter.getInstance({ maxRequests: 50, timeWindow: 3600 });
    // Mock rate limiter check
    vi.spyOn(RateLimiter.prototype, 'checkLimit').mockReturnValue(true);
  });

  test('sends message and returns response', async () => {
    const response = await sendMessage(testMessages, testPersona);
    expect(response).toBeDefined();
    expect(response?.content).toBeDefined();
    expect(metrics.recordMetric).toHaveBeenCalledWith('message_request_start', 1);
    expect(analytics.trackEvent).toHaveBeenCalledWith('message_sent', expect.any(Object));
  });

  test('handles validation errors', async () => {
    const invalidMessages = [{ id: '1', role: 'invalid' as any, content: '' }];
    await expect(sendMessage(invalidMessages, testPersona))
      .rejects.toThrow(ValidationError);
  });

  test('handles rate limiting', async () => {
    vi.spyOn(RateLimiter.prototype, 'checkLimit').mockReturnValue(false);
    await expect(sendMessage(testMessages, testPersona))
      .rejects.toThrow('Rate limit exceeded');
  });

  test('sanitizes input', async () => {
    const messagesWithHtml = [
      { id: '1', role: 'user' as const, content: '<script>alert("xss")</script>Hello' }
    ];
    const response = await sendMessage(messagesWithHtml, testPersona);
    expect(response?.content).toBeDefined();
    expect(response?.content).not.toContain('<script>');
  });
});