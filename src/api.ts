import OpenAI from 'openai';
import { config } from './config/env';
import type { AIPersona } from './config/personas/types';
import { calculateSimilarity } from './utils/textMatching';
import { formatPersonaResponse } from './utils/personaFormatter';
import { integrateKnowledge } from './utils/knowledgeIntegration';
import { validateMessages } from './utils/validation';
import { logger } from './utils/logger';
import { analytics } from './utils/analytics';
import { cache } from './utils/cache';
import { metrics } from './utils/metrics';
import { sanitizeInput, validateContentSecurity } from './utils/security';

const DEFAULT_MODEL = "cognitivecomputations/dolphin-mixtral-8x22b";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.siteUrl,
    "X-Title": config.appName,
  },
  dangerouslyAllowBrowser: true
});

function findBestMatch(message: string, persona: AIPersona) {
  const integrated = integrateKnowledge(persona);
  let bestMatch = null;
  let highestSimilarity = 0;

  for (const qa of integrated.qa) {
    const similarity = calculateSimilarity(message, qa.question);
    if (similarity > highestSimilarity && similarity > 0.25) {
      bestMatch = qa;
      highestSimilarity = similarity;
    }
  }

  return bestMatch;
}

export async function sendMessage(messages: { role: string; content: string }[], persona: AIPersona) {
  try {
    // Validate messages
    validateMessages(messages);

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user') {
      // Sanitize and validate input
      const sanitizedContent = sanitizeInput(lastUserMessage.content);
      if (!validateContentSecurity(sanitizedContent)) {
        throw new Error('Invalid content detected');
      }

      // Start performance monitoring
      metrics.recordMetric('message_request', 1);
      const requestStart = performance.now();

      const integrated = integrateKnowledge(persona);
      const matchingQA = findBestMatch(sanitizedContent, persona);
      
      // Create system message with integrated knowledge
      const systemMessage = `${persona.systemPrompt}

KNOWLEDGE BASE INTEGRATION:
1. Topics of Expertise: ${integrated.topics.join(', ')}
2. Context-Specific Instructions: ${integrated.prompts.join(' ')}

RESPONSE GUIDELINES:
1. Primary Source: Always prioritize knowledge base answers when available
2. Consistency: Maintain ${persona.name}'s personality and style
3. Accuracy: Only use verified information from the knowledge base
4. Fallback: Use general knowledge only when no knowledge base match exists`;

      const updatedMessages = [
        { role: 'system', content: systemMessage },
        ...messages.map(m => ({ ...m, content: sanitizeInput(m.content) }))
      ];

      if (matchingQA) {
        const knowledgeBaseContext = `VERIFIED KNOWLEDGE BASE ANSWER:
Source: ${matchingQA.source}
Category: ${matchingQA.category}
Answer: "${matchingQA.answer}"

INSTRUCTIONS:
1. Use this verified answer as your primary source
2. Maintain your persona while delivering this information
3. Do not add external information to this answer
4. Present the information naturally in your style`;

        updatedMessages.splice(1, 0, { 
          role: 'system', 
          content: knowledgeBaseContext 
        });
      }

      const completion = await openai.chat.completions.create({
        model: persona.model || DEFAULT_MODEL,
        messages: updatedMessages
      });

      const response = completion.choices[0].message;
      if (response) {
        response.content = formatPersonaResponse(response.content || '', persona);
      }

      // Record metrics and analytics
      const requestDuration = performance.now() - requestStart;
      metrics.recordMetric('message_response_time', requestDuration);
      analytics.trackEvent('message_sent', {
        persona: persona.name,
        hasKnowledgeMatch: !!matchingQA,
        duration: requestDuration
      });

      return response;
    }
  } catch (error) {
    logger.error('Error in sendMessage:', error);
    throw error;
  }
}