import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize dark mode from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('accessToken');
    if (!isLoggedIn) {
      return false; // Default to light mode for non-logged in users
    }
    
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // If logged in but no saved preference, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage only if user is logged in
    if (localStorage.getItem('accessToken')) {
      localStorage.setItem('darkMode', isDarkMode);
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  return (
    <AppContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      language,
      toggleLanguage,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 