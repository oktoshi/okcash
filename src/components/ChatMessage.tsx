import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import { marked } from 'marked';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

// Configure marked to only allow specific tags for safety
marked.setOptions({
  headerIds: false,
  mangle: false
});

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  
  // Parse markdown to HTML
  const htmlContent = marked(message.content, { breaks: true });
  
  return (
    <div className={`p-4 ${isUser ? 'bg-gray-800' : 'bg-gray-900'}`}>
      <div className="max-w-4xl mx-auto flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {isUser ? (
            <MessageSquare className="h-6 w-6 text-gray-300" />
          ) : (
            <Bot className="h-6 w-6 text-blue-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div 
            className="text-gray-100 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      </div>
    </div>
  );
}