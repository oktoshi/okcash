import { useEffect } from 'react';

export function useKnowledgeReload() {
  useEffect(() => {
    // Watch for changes in knowledge and persona files
    const knowledgeContext = import.meta.glob('../config/{knowledge,personas}/**/*.ts');
    
    // Create a map to store module promises
    const modules = new Map();
    
    // Load all modules
    Object.entries(knowledgeContext).forEach(([path, moduleLoader]) => {
      modules.set(path, moduleLoader());
    });
    
    // Handle hot module replacement
    if (import.meta.hot) {
      const handleUpdate = () => {
        modules.clear();
        window.location.reload();
      };

      import.meta.hot.on('vite:beforeUpdate', handleUpdate);
      
      return () => {
        import.meta.hot?.off('vite:beforeUpdate', handleUpdate);
      };
    }
  }, []);
}