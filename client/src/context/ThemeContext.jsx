import React, { createContext, useContext, useEffect } from 'react';

// LegalEase AI is a dark-first product — the design system in the brief is
// built around a single deep-navy identity, so theme is fixed to 'dark'.
// The context/hook shape is kept so any existing page importing useTheme()
// keeps working without changes.
const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
