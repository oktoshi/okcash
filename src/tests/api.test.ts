import { describe, test, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';
import { analytics } from '../utils/analytics';
import { RateLimiter } from '../utils/rateLimit';
import * as validation from '../utils/validation';
import { ValidationError } from '../utils/errors';

// Mock all dependencies
vi.mock('../utils/logger');
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');
vi.mock('../utils/rateLimit');
vi.mock('../utils/cache');
vi.mock('../utils/validation');

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
    { id: '1', role: 'user', content: 'Hello' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validation.validateMessages).mockReturnValue(testMessages);
  });

  test('sends message and returns response', async () => {
    const response = await sendMessage(testMessages, testPersona);
    expect(response).toBeDefined();
    expect(response?.content).toBeDefined();
    expect(metrics.recordMetric).toHaveBeenCalledWith('message_request_start', 1);
    expect(analytics.trackEvent).toHaveBeenCalledWith('message_sent', expect.any(Object));
  });

  test('handles validation errors', async () => {
    vi.mocked(validation.validateMessages).mockImplementation(() => {
      throw new ValidationError('Invalid message');
    });
    await expect(sendMessage(testMessages, testPersona))
      .rejects.toThrow(ValidationError);
    expect(logger.error).toHaveBeenCalled();
  });

  test('handles rate limiting', async () => {
    vi.spyOn(RateLimiter.prototype, 'checkLimit').mockReturnValue(false);
    await expect(sendMessage(testMessages, testPersona))
      .rejects.toThrow('Rate limit exceeded');
  });
});