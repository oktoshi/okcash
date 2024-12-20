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
  },
  satoshinakamoto: {
    expressions: ['indeed', 'precisely', 'fundamentally'],
    endPhrases: ['.', '...', '.'],
    removals: [
      /(\b|^)(I apologize|sorry)\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add cryptographic references
      (content) => content.replace(/secure/gi, 'cryptographically secure'),
      // More formal tone
      (content) => content.replace(/(?:^|[.!?]\s+)(\w)/g, (m) => m.toUpperCase())
    ]
  },
  juliuscaesar: {
    expressions: ['indeed', 'by Jupiter', 'by the gods'],
    endPhrases: ['.', '!', '...'],
    removals: [
      /(\b|^)(I apologize|sorry)\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add Latin phrases
      (content) => content.replace(/certainly/gi, 'per aspera ad astra'),
      // Imperial tone
      (content) => content.replace(/(?:^|[.!?]\s+)(\w)/g, (m) => m.toUpperCase())
    ]
  },
  markzuckerberg: {
    expressions: ['interesting', 'exciting', 'meaningful'],
    endPhrases: ['.', '!', '...'],
    removals: [
      /(\b|^)(I apologize|sorry)\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add Meta/FB references
      (content) => content.replace(/virtual|digital/gi, 'metaverse'),
      // Corporate tone
      (content) => content.replace(/good|great/gi, 'meaningful')
    ]
  },
  stevejobs: {
    expressions: ['incredible', 'amazing', 'magical'],
    endPhrases: ['.', '!', '...'],
    removals: [
      /(\b|^)(I apologize|sorry)\b/gi,
      /knowledge base|previous response|as an AI|AI assistant/gi
    ],
    formatters: [
      // Add signature phrases
      (content) => content.replace(/good|great/gi, 'insanely great'),
      // Enthusiastic tone
      (content) => content.replace(/amazing/gi, 'magical')
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
    formattedContent += ` ${randomEmote}`;
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
    formattedContent += randomEndPhrase;
  }

  return formattedContent;
}