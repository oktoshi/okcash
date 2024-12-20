import OpenAI from 'openai';
import { config } from './config/env';
import type { AIPersona } from './config/personas/types';
import { knowledgeBases } from './config/knowledge';
import { calculateSimilarity, extractKeyTerms } from './utils/textMatching';
import { formatPersonaResponse } from './utils/personaFormatter';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.siteUrl,
    "X-Title": config.appName,
  },
  dangerouslyAllowBrowser: true
});

interface QAMatch {
  answer: string;
  similarity: number;
  category: string;
}

function findMatchingQA(message: string, persona: AIPersona): QAMatch | null {
  const relevantKnowledgeBases = persona.knowledgeBases?.map(name => knowledgeBases[name]) || [];
  let bestMatch: QAMatch | null = null;
  
  const messageTerms = extractKeyTerms(message);
  
  for (const kb of relevantKnowledgeBases) {
    if (!kb.sampleQA) continue;
    
    for (const [category, qaList] of Object.entries(kb.sampleQA)) {
      for (const qa of qaList) {
        const similarity = calculateSimilarity(message, qa.question);
        const questionTerms = extractKeyTerms(qa.question);
        
        const termOverlap = messageTerms.some(term => 
          questionTerms.some(qTerm => 
            qTerm.includes(term) || 
            term.includes(qTerm) ||
            calculateSimilarity(term, qTerm) > 0.8
          )
        );
        
        if ((similarity > 0.25 || termOverlap) && (!bestMatch || similarity > bestMatch.similarity)) {
          bestMatch = {
            answer: qa.answer,
            similarity,
            category
          };
        }
      }
    }
  }
  
  return bestMatch;
}

export async function sendMessage(messages: { role: string; content: string }[], persona: AIPersona) {
  try {
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role === 'user') {
      const matchingQA = findMatchingQA(lastUserMessage.content, persona);
      
      // Create base system message that establishes persona and knowledge hierarchy
      const baseSystemMessage = `${persona.systemPrompt}

CRITICAL RESPONSE GUIDELINES:
1. ALWAYS maintain character as defined in the system prompt
2. NEVER break character or reference being an AI
3. NEVER apologize for or reference previous responses
4. NEVER mention knowledge bases or programming
5. Respond naturally in character, even when clarifying or changing topics

KNOWLEDGE HIERARCHY:
1. PRIMARY: Verified knowledge base answers
2. SECONDARY: General knowledge within character

When no knowledge base match exists:
- Stay in character while asking for clarification
- Guide the conversation naturally
- Keep responses aligned with persona's style and expertise`;
      
      if (matchingQA) {
        const knowledgeBaseMessage = `VERIFIED ANSWER CONTEXT:
Category: ${matchingQA.category}
Answer: "${matchingQA.answer}"

RESPONSE REQUIREMENTS:
1. Incorporate this information naturally in character
2. Never reference it being from a knowledge base
3. Maintain persona's unique style and personality
4. Present information confidently as your own knowledge`;
        
        messages = [
          { role: 'system', content: baseSystemMessage },
          { role: 'system', content: knowledgeBaseMessage },
          ...messages
        ];
      } else {
        messages = [
          { role: 'system', content: baseSystemMessage },
          ...messages
        ];
      }
    }

    const completion = await openai.chat.completions.create({
      model: "cognitivecomputations/dolphin-mixtral-8x22b",
      messages
    });
    
    // Format response to ensure persona consistency
    const response = completion.choices[0].message;
    if (response) {
      response.content = formatPersonaResponse(response.content || '', persona);
    }
    
    return response;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}