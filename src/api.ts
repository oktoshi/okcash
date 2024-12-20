import OpenAI from 'openai';
import { config } from './config/env';
import type { AIPersona } from './config/personas/types';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.siteUrl,
    "X-Title": config.appName,
  },
  dangerouslyAllowBrowser: true
});

export async function sendMessage(messages: { role: string; content: string }[], persona: AIPersona) {
  try {
    // Add system message with persona's prompt
    const messagesWithPersona = [
      { role: 'system', content: persona.systemPrompt },
      ...messages
    ];

    const completion = await openai.chat.completions.create({
      model: "cognitivecomputations/dolphin-mixtral-8x22b",
      messages: messagesWithPersona
    });
    
    return completion.choices[0].message;
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
}