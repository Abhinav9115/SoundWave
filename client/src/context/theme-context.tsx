import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'vibrant' | 'ocean' | 'sunset';
type ColorScheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme && ['vibrant', 'ocean', 'sunset'].includes(savedTheme)) {
        return savedTheme as Theme;
      }
    }
    return 'vibrant'; // Default theme
  });

  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() => {
    if (typeof window !== 'undefined') {
      const savedScheme = localStorage.getItem('colorScheme');
      if (savedScheme && ['dark', 'light'].includes(savedScheme)) {
        return savedScheme as ColorScheme;
      }
    }
    return 'dark';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    updateDocumentClasses(newTheme, colorScheme);
  };

  const setColorScheme = (newScheme: ColorScheme) => {
    setColorSchemeState(newScheme);
    localStorage.setItem('colorScheme', newScheme);
    updateDocumentClasses(theme, newScheme);
  };

  const updateDocumentClasses = (currentTheme: Theme, currentScheme: ColorScheme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    root.classList.remove('light', 'dark');
    root.classList.add(currentScheme);
  };

  // Apply theme and color scheme on mount and when they change
  useEffect(() => {
    updateDocumentClasses(theme, colorScheme);
  }, [theme, colorScheme]);

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 