// src/context/ThemeContext.jsx
import { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAtajoTeclado } from '../hooks/useAtajoTeclado';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // useLocalStorage persiste el tema entre sesiones (custom hook)
  const [tema, setTema] = useLocalStorage('tema', 'oscuro');

  // Aplica el atributo al body cada vez que cambia el tema.
  // El guardado en localStorage ya lo hace useLocalStorage.
  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
  }, [tema]);

  const toggleTema = () =>
    setTema((prev) => (prev === 'oscuro' ? 'claro' : 'oscuro'));

  // Atajo T para cambiar tema (custom hook, antes era un listener manual)
  useAtajoTeclado('t', toggleTema);

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
}
