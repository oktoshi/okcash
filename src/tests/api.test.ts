import { describe, test, expect, vi } from 'vitest';
import { sendMessage } from '../api';
import { personas } from '../config/personas';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';
import { analytics } from '../utils/analytics';
import { RateLimiter } from '../utils/rateLimit';
import * as knowledgeIntegration from '../utils/knowledgeIntegration';
import * as messageProcessor from '../utils/messageProcessor';
import * as responseFormatter from '../utils/responseFormatter';
import { ValidationError } from '../utils/errors';

// Mock all dependencies
vi.mock('../utils/logger');
vi.mock('../utils/metrics');
vi.mock('../utils/analytics');
vi.mock('../utils/rateLimit');
vi.mock('../utils/cache');
vi.mock('../utils/knowledgeIntegration');
vi.mock('../utils/messageProcessor');
vi.mock('../utils/responseFormatter');

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

  test('sends message and returns response', async () => {
    vi.mocked(messageProcessor.processMessages).mockImplementation(msgs => msgs);
    vi.mocked(knowledgeIntegration.integrateKnowledge).mockResolvedValue({
      topics: ['test'],
      prompts: ['test'],
      qa: []
    });
    vi.mocked(knowledgeIntegration.findBestMatch).mockResolvedValue(null);
    vi.mocked(responseFormatter.formatResponse).mockImplementation(msg => msg);

    const response = await sendMessage(testMessages, testPersona);
    expect(response).toBeDefined();
    expect(response?.content).toBeDefined();
    expect(metrics.recordMetric).toHaveBeenCalledWith('message_request_start', 1);
    expect(analytics.trackEvent).toHaveBeenCalledWith('message_sent', expect.any(Object));
  });

  test('handles validation errors', async () => {
    vi.mocked(messageProcessor.processMessages).mockImplementationOnce(() => {
      throw new ValidationError('Invalid message');
    });
    await expect(sendMessage(testMessages, testPersona))
      .rejects.toThrow(ValidationError);
    expect(logger.error).toHaveBeenCalled();
  });

  test('handles rate limiting', async () => {
    vi.spyOn(RateLimiter.prototype, 'checkLimit').mockReturnValueOnce(false);
    await expect(sendMessage(testMessages, testPersona))
      .rejects.toThrow('Rate limit exceeded');
  });
});