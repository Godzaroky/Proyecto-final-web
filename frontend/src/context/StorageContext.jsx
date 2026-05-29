// src/context/StorageContext.jsx
// Heredado de Fase 2 — StorageContext híbrido (API ↔ LocalStorage)
// Los componentes NO saben de qué fuente vienen los datos.
import { createContext, useState, useCallback } from 'react';

export const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem('modo') || 'local'
  );
  const [cargando, setCargando] = useState(false);
  const [error, setError]       = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const setModo = (nuevoModo) => {
    setModoState(nuevoModo);
    localStorage.setItem('modo', nuevoModo);
  };

  const obtenerItems = useCallback(async () => {
    setCargando(true); setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } else {
        const data = localStorage.getItem('items');
        return data ? JSON.parse(data) : [];
      }
    } catch (err) {
      setError(err.message); return [];
    } finally {
      setCargando(false);
    }
  }, [modo, API_URL]);

  const guardarItem = useCallback(async (item) => {
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      }
      // En modo local el reducer ya actualizó el estado y App.jsx persiste
    } catch (err) {
      setError(err.message);
    }
  }, [modo, API_URL]);

  const eliminarItem = useCallback(async (id) => {
    try {
      if (modo === 'api') {
        await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
      }
      // En modo local el reducer setea activo = false
    } catch (err) {
      setError(err.message);
    }
  }, [modo, API_URL]);

  return (
    <StorageContext.Provider
      value={{ modo, setModo, cargando, error, obtenerItems, guardarItem, eliminarItem }}
    >
      {children}
    </StorageContext.Provider>
  );
}
