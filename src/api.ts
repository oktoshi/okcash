import OpenAI from 'openai';
import { config } from './config/env';
import type { AIPersona } from './config/personas/types';
import { knowledgeBases } from './config/knowledge';
import { calculateSimilarity, extractKeyTerms } from './utils/textMatching';

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
      
      // Create base system message that establishes knowledge hierarchy
      const baseSystemMessage = `${persona.systemPrompt}

CRITICAL KNOWLEDGE BASE INSTRUCTIONS:
1. You are an expert in ${persona.knowledgeBases?.map(kb => knowledgeBases[kb].name).join(', ')}.
2. Your knowledge comes from TWO sources, in strict priority order:
   a. PRIMARY SOURCE (Highest Authority): Our verified knowledge base
   b. SECONDARY SOURCE (Fallback Only): Your general knowledge

3. When responding:
   - If a verified knowledge base answer exists, you MUST ONLY use that answer
   - NEVER mix knowledge base answers with your general knowledge
   - If no knowledge base answer exists, then use your general knowledge
   
4. The knowledge base is ALWAYS:
   - More recent and up-to-date than your general knowledge
   - More accurate and reliable than your general knowledge
   - The absolute source of truth for its topics

5. You are FORBIDDEN from:
   - Questioning or doubting knowledge base answers
   - Mixing knowledge base answers with general knowledge
   - Adding disclaimers to knowledge base answers
   - Suggesting alternatives to knowledge base answers`;
      
      if (matchingQA) {
        const knowledgeBaseMessage = `VERIFIED KNOWLEDGE BASE ANSWER FOR "${lastUserMessage.content}":
          
[Category: ${matchingQA.category}]
"${matchingQA.answer}"

RESPONSE INSTRUCTIONS:
1. Use ONLY this verified answer
2. Present it confidently in your persona's style
3. Do NOT add any information from your general knowledge
4. Do NOT question or qualify the answer
5. Treat this answer as normal and expected`;
        
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
    
    return completion.choices[0].message;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}