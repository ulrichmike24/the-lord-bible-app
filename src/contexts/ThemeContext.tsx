import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'white' | 'black';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
  isWhite: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'white',
  toggleTheme: () => {},
  setTheme: () => {},
  isWhite: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('bible_ai_theme');
      if (saved === 'black') return 'black';
      return 'white'; // Default is White and Black as requested
    } catch {
      return 'white';
    }
  });

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    try {
      localStorage.setItem('bible_ai_theme', t);
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === 'white' ? 'black' : 'white');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'black') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      root.style.backgroundColor = '#000000';
      document.body.style.backgroundColor = '#000000';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      root.style.backgroundColor = '#ffffff';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isWhite: theme === 'white' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
