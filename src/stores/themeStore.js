import { useState, useEffect, useCallback } from 'react';

function useThemeStore() {

  const STORAGE_KEY = 'theme-storage';

  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    if(typeof window !== 'undefined'){
      localStorage.setItem(STORAGE_KEY, theme);
    }
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
  }, []);

  return { theme, setTheme };
}

export default useThemeStore;
