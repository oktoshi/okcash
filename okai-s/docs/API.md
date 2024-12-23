# OKai-S API Documentation

## Table of Contents

1. [Setup](#setup)
2. [Configuration](#configuration)
3. [Core Components](#core-components)
4. [Integration Examples](#integration-examples)
5. [Security](#security)

## Setup

### Environment Variables

Create a `.env` file with:

```env
VITE_OPENROUTER_API_KEY=your_api_key_here
VITE_SITE_URL=your_site_url
VITE_APP_NAME=your_app_name
```

### OpenRouter Integration

OKai-S uses OpenRouter for AI model access. To set up:

1. Get an API key from [OpenRouter](https://openrouter.ai)
2. Add the key to your `.env` file
3. Configure allowed models in OpenRouter dashboard

## Configuration

### Persona Configuration

```typescript
interface AIPersona {
  name: string;
  description: string;
  systemPrompt: string;
  knowledgeBases?: string[];
  customKnowledge?: string[];
  displayOrder?: number;
  model?: string; // Override default model
}
```

Example:
```typescript
const persona: AIPersona = {
  name: "Tech Expert",
  description: "Technical support specialist",
  systemPrompt: "You are a technical expert...",
  knowledgeBases: ['technology'],
  model: "openai/gpt-4-turbo"
};
```

### Knowledge Base Configuration

```typescript
interface KnowledgeBase {
  name: string;
  topics: {
    [key: string]: string[];
  };
  prompts: {
    [key: string]: string;
  };
  sampleQA?: {
    [category: string]: {
      question: string;
      answer: string;
    }[];
  };
}
```

Example:
```typescript
const knowledge: KnowledgeBase = {
  name: "Technology",
  topics: {
    general: ["Hardware", "Software"]
  },
  prompts: {
    technical: "Provide technical details..."
  },
  sampleQA: {
    basics: [{
      question: "What is RAM?",
      answer: "RAM (Random Access Memory)..."
    }]
  }
};
```

## Core Components

### Message API

```typescript
async function sendMessage(
  messages: { role: string; content: string }[], 
  persona: AIPersona
) {
  // Returns AI response
}
```

### Knowledge Integration

```typescript
function integrateKnowledge(
  persona: AIPersona
): IntegratedKnowledge {
  // Returns integrated knowledge
}
```

## Integration Examples

### Basic Usage

```typescript
import { sendMessage } from '@okai/core';

// Initialize with persona
const response = await sendMessage([
  { role: 'user', content: 'Hello!' }
], techExpertPersona);
```

### Custom Persona

```typescript
import { AIPersona } from '@okai/types';

const customPersona: AIPersona = {
  name: "Custom Expert",
  description: "Specialized knowledge",
  systemPrompt: "You are an expert in...",
  knowledgeBases: ['custom-knowledge']
};
```

## Security

### Best Practices

1. API Key Protection
   - Never expose API keys in client-side code
   - Use environment variables
   - Implement rate limiting

2. Input Validation
   - Sanitize user input
   - Validate message length
   - Check for malicious content

3. Error Handling
   - Implement proper error boundaries
   - Log errors securely
   - Provide user-friendly error messages

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const rateLimiter = {
  maxRequests: 50,
  timeWindow: 3600, // 1 hour
};
```

## Need Help?

Join our community:
- Discord: [discord.gg/grvpc8c](https://discord.gg/grvpc8c)
- Telegram: [t.me/ok_heroes](https://t.me/ok_heroes)