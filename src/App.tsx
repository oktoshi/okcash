import React, { useState, useCallback } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { PersonaSidebar } from './components/PersonaSidebar';
import { usePersona } from './hooks/usePersona';
import { useChatFocusProvider, ChatFocusContext } from './hooks/useChatFocus';
import { useKnowledgeReload } from './hooks/useKnowledgeReload';
import { useChatScroll } from './hooks/useChatScroll';
import { sendMessage } from './api';
import { Github } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import type { Message } from './types';

export default function App() {
  useKnowledgeReload();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentPersona, changePersona, availablePersonas } = usePersona();
  const chatFocus = useChatFocusProvider();
  const { scrollContainerRef, messagesEndRef, handleContentUpdate, scrollToBottom } = 
    useChatScroll({ messages, isTyping: isLoading });

  const handlePersonaChange = useCallback((personaKey: string) => {
    changePersona(personaKey);
    setMessages([]);
    chatFocus.focusInput();
  }, [changePersona, chatFocus]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { id: uuidv4(), role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiMessages = messages.concat(userMessage);
      const response = await sendMessage(apiMessages, currentPersona);
      
      if (response) {
        setMessages(prev => [...prev, {
          id: uuidv4(),
          role: 'assistant',
          content: response.content || 'Sorry, I could not generate a response.'
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatFocusContext.Provider value={chatFocus}>
      <div className="flex flex-col h-full bg-gray-900">
        <header className="flex-none p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white text-center">OKai S</h1>
        </header>
        
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
            <div className="max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400 min-h-[200px]">
                  <p>Start a conversation with {currentPersona.name} by typing a message below.</p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {messages.map((message) => (
                    <ChatMessage 
                      key={message.id}
                      message={message}
                      isTyping={isLoading && message === messages[messages.length - 1]}
                      shouldAnimate={message.role === 'assistant'}
                      onContentUpdate={handleContentUpdate}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </main>

          <PersonaSidebar
            personas={availablePersonas}
            currentPersona={currentPersona}
            onPersonaChange={handlePersonaChange}
          />
        </div>

        <footer className="flex-none border-t border-gray-800">
          <div className="max-w-4xl mx-auto w-full">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            <div className="px-4 pb-2 flex justify-between items-center text-xs text-gray-500">
              <span>
                <a href="https://okai-s.github.io" className="hover:text-blue-400 transition-colors">OKai-S</a>
                {' '}by{' '}
                <a href="https://okcash.org" className="hover:text-blue-400 transition-colors">OK</a>
                {' '}© 2025
              </span>
              <a
                href="https://github.com/ok-devs/okai-s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs mr-5"
              >
                <Github className="h-3.5 w-3.5" />
                <span>Use me for your project</span>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </ChatFocusContext.Provider>
  );
}