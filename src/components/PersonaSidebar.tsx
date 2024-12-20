import React from 'react';
import { User } from 'lucide-react';
import { personas } from '../config/personas';
import type { AIPersona } from '../config/personas/types';

interface PersonaSidebarProps {
  personas: string[];
  currentPersona: AIPersona;
  onPersonaChange: (key: string) => void;
}

export function PersonaSidebar({ personas: personaKeys, currentPersona, onPersonaChange }: PersonaSidebarProps) {
  return (
    <div className="w-64 border-l border-gray-800 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Choose Persona</h2>
      <div className="space-y-2">
        {personaKeys.map((personaKey) => {
          const persona = personas[personaKey as keyof typeof personas];
          if (!persona) return null;
          
          return (
            <button
              key={personaKey}
              onClick={() => onPersonaChange(personaKey)}
              className={`w-full flex flex-col gap-2 p-4 rounded-lg transition-colors ${
                currentPersona.name === persona.name
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{persona.name}</span>
              </div>
              <p className="text-xs text-left opacity-80 line-clamp-2">
                {persona.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}