// src/context/ThemeContext.jsx
import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(
    () => localStorage.getItem('tema') || 'oscuro'
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  useEffect(() => {
    const handler = (e) => {
      const enInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (enInput) return;
      if (e.key.toLowerCase() === 't') {
        setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTema = () => setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}