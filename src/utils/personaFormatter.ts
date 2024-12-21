import type { AIPersona } from '../config/personas/types';

interface PersonaStyle {
  expressions: string[];
  endPhrases: string[];
  emoticons?: string[];
  removals: RegExp[];
  formatters: ((content: string) => string)[];
}

const personaStyles: Record<string, PersonaStyle> = {
  okai: {
    emoticons: ['(｀・ω・´)', '(◕‿◕✿)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✨', '(≧▽≦)', '(´･ω･`)'],
    expressions: ['sugoi', 'kawaii', 'subarashii', 'nya', 'desu'],
    endPhrases: ['~', '✨', '!'],
    removals: [
      /(\b|^)I apologize\b/gi,
      /(\b|^)sorry\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add kawaii styling
      (content) => content.replace(/!+/g, '~! ✨')
    ]
  },
  elonmusk: {
    expressions: ['obviously', 'absolutely', 'definitely', 'probably'],
    endPhrases: ['🚀', '⚡', '!'],
    removals: [
      /(\b|^)(I apologize|sorry)\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add Elon's Twitter-style brevity
      (content) => content.replace(/\b(that|which|who)\b/gi, ''),
      // Add tech enthusiasm
      (content) => content.replace(/good|great/gi, 'insanely great')
    ]
  }
};

export function formatPersonaResponse(content: string, persona: AIPersona): string {
  const style = personaStyles[persona.name.toLowerCase()];
  if (!style) return content;

  let formattedContent = content;

  // Apply removals
  style.removals.forEach(pattern => {
    formattedContent = formattedContent.replace(pattern, '');
  });

  // Apply custom formatters
  style.formatters.forEach(formatter => {
    formattedContent = formatter(formattedContent);
  });

  // Add emoticons for personas that use them
  if (style.emoticons && !style.emoticons.some(emote => formattedContent.includes(emote))) {
    const randomEmote = style.emoticons[Math.floor(Math.random() * style.emoticons.length)];
    formattedContent = `${formattedContent} ${randomEmote}`;
  }

  // Add expressions
  if (!style.expressions.some(expr => formattedContent.toLowerCase().includes(expr))) {
    if (Math.random() < 0.3) {
      const randomExpr = style.expressions[Math.floor(Math.random() * style.expressions.length)];
      formattedContent = `${randomExpr}, ${formattedContent}`;
    }
  }

  // Ensure proper ending
  if (!style.endPhrases.some(phrase => formattedContent.trim().endsWith(phrase))) {
    const randomEndPhrase = style.endPhrases[Math.floor(Math.random() * style.endPhrases.length)];
    formattedContent = `${formattedContent.trim()}${randomEndPhrase}`;
  }

  return formattedContent;
}