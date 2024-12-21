import type { Message } from '../types';
import type { AIPersona } from '../config/personas/types';
import { formatPersonaResponse } from './personaFormatter';

export function formatResponse(message: Message, persona: AIPersona): Message {
  return {
    ...message,
    content: formatPersonaResponse(message.content, persona)
  };
}