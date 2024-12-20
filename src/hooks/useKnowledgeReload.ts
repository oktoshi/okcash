import { useEffect } from 'react';

// Force reload when knowledge bases or personas change
export function useKnowledgeReload() {
  useEffect(() => {
    // Watch for changes in knowledge and persona files
    const knowledgeContext = import.meta.glob('../config/{knowledge,personas}/**/*.ts');
    
    // Create a map to store module promises
    const modules = new Map();
    
    Object.entries(knowledgeContext).forEach(([path, moduleLoader]) => {
      modules.set(path, moduleLoader());
    });
    
    // Vite's hot module replacement
    if (import.meta.hot) {
      import.meta.hot.on('vite:beforeUpdate', () => {
        // Clear module cache and reload the page
        modules.clear();
        window.location.reload();
      });
    }
  }, []);
}