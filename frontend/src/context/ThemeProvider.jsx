import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }) {
  const [tema, setTemaState] = useState(
    () => localStorage.getItem('tema') || 'oscuro'
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = () =>
    setTemaState((t) => (t === 'oscuro' ? 'claro' : 'oscuro'));

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
