import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}

export function UserProvider({ children }) {
  const [nombre, setNombre] = useState(
    () => localStorage.getItem('user_nombre') || 'Gamer'
  );
  const [preferencias, setPreferencias] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user_prefs') || '{}');
    } catch {
      return {};
    }
  });

  const actualizarNombre = (nuevoNombre) => {
    setNombre(nuevoNombre);
    localStorage.setItem('user_nombre', nuevoNombre);
  };

  const actualizarPreferencias = (nuevas) => {
    const merged = { ...preferencias, ...nuevas };
    setPreferencias(merged);
    localStorage.setItem('user_prefs', JSON.stringify(merged));
  };

  return (
    <UserContext.Provider
      value={{ nombre, preferencias, actualizarNombre, actualizarPreferencias }}
    >
      {children}
    </UserContext.Provider>
  );
}
