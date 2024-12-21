import { describe, test, expect, vi, beforeEach } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';
import { analytics } from '../utils/analytics';
import { RateLimiter } from '../utils/rateLimit';
import * as messageProcessor from '../utils/messageProcessor';
import { ValidationError } from '../utils/errors';

// Mock all dependencies
vi.mock('../utils/logger');
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');
vi.mock('../utils/rateLimit');
vi.mock('../utils/cache');
vi.mock('../utils/messageProcessor');

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
    vi.mocked(messageProcessor.processMessages).mockReturnValue(testMessages);
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
    vi.mocked(messageProcessor.processMessages).mockImplementation(() => {
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

  test('processes messages before sending', async () => {
    await sendMessage(testMessages, testPersona);
    expect(messageProcessor.processMessages).toHaveBeenCalledWith(testMessages);
  });
});