import OpenAI from 'openai';
import { config } from './config/env';
import type { Message } from './types';
import type { AIPersona } from './config/personas/types';
import { processMessages } from './utils/messageProcessor';
import { formatResponse } from './utils/responseFormatter';
import { findBestMatch, integrateKnowledge } from './utils/knowledgeIntegration';
import { logger } from './utils/logger';
import { analytics } from './utils/analytics';
import { metrics } from './utils/metrics';
import { RateLimiter } from './utils/rateLimit';
import { ValidationError, APIError } from './utils/errors';

const DEFAULT_MODEL = "cognitivecomputations/dolphin-mixtral-8x22b";
const rateLimiter = RateLimiter.getInstance();

// Validate API key before creating client
if (!config.openRouterApiKey) {
  throw new Error('OpenRouter API key is required. Please add VITE_OPENROUTER_API_KEY to your .env file.');
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.siteUrl || window.location.origin,
    "X-Title": config.appName || 'OKai S',
  },
  dangerouslyAllowBrowser: true
});

export async function sendMessage(messages: Message[], persona: AIPersona): Promise<Message | undefined> {
  const requestId = crypto.randomUUID();
  
  try {
    metrics.recordMetric('message_request_start', 1);

    if (!rateLimiter.checkLimit(requestId)) {
      throw new Error('Rate limit exceeded');
    }

    // Process and validate all messages
    const processedMessages = processMessages(messages);
    if (processedMessages.length === 0) {
      throw new ValidationError('No valid messages to process');
    }

    const lastMessage = processedMessages[processedMessages.length - 1];
    if (lastMessage.role !== 'user') {
      throw new ValidationError('Last message must be from user');
    }

    // Get knowledge context
    const integrated = await integrateKnowledge(persona);
    const matchingQA = await findBestMatch(lastMessage.content, persona);

    // Create system message with integrated knowledge
    const systemMessage: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: `${persona.systemPrompt}

KNOWLEDGE BASE INTEGRATION:
1. Topics of Expertise: ${integrated.topics.join(', ')}
2. Context-Specific Instructions: ${integrated.prompts.join(' ')}

${matchingQA ? `VERIFIED KNOWLEDGE BASE ANSWER:
Source: ${matchingQA.source}
Category: ${matchingQA.category}
Answer: "${matchingQA.answer}"` : ''}

RESPONSE GUIDELINES:
1. Primary Source: Always prioritize knowledge base answers when available
2. Consistency: Maintain ${persona.name}'s personality and style
3. Accuracy: Only use verified information from the knowledge base
4. Fallback: Use general knowledge only when no knowledge base match exists`
    };

    try {
      const completion = await openai.chat.completions.create({
        model: persona.model || DEFAULT_MODEL,
        messages: [systemMessage, ...processedMessages].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const response = completion.choices[0].message;
      if (!response?.content) {
        throw new Error('No response content received');
      }

      const formattedResponse = formatResponse(
        { id: crypto.randomUUID(), role: 'assistant', content: response.content },
        persona
      );

      analytics.trackEvent('message_sent', {
        persona: persona.name,
        hasKnowledgeMatch: !!matchingQA,
        requestId
      });

      return formattedResponse;

    } catch (error: any) {
      // Handle specific API errors
      if (error.status === 401) {
        throw new APIError('Invalid OpenRouter API key. Please check your configuration.', 401);
      }
      throw error;
    }

  } catch (error) {
    logger.error('Error in sendMessage:', error);
    throw error;
  }
}