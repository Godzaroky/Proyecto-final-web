import { useState, useCallback, useRef } from 'react';
import { StorageContext } from './StorageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const LS_KEY = 'juegos';

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem('modo') || 'local'
  );
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // useRef #2: referencia al intervalo de auto-guardado sin provocar re-render
  const autoGuardadoRef = useRef(null);

  const setModo = useCallback((nuevoModo) => {
    setModoState(nuevoModo);
    localStorage.setItem('modo', nuevoModo);
  }, []);

  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } else {
        const data = localStorage.getItem(LS_KEY);
        return data ? JSON.parse(data) : [];
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setCargando(false);
    }
  }, [modo]);

  const guardarItem = useCallback(async (item) => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const esNuevo = !item.id;
        const url = esNuevo
          ? `${API_URL}/api/items`
          : `${API_URL}/api/items/${item.id}`;
        const res = await fetch(url, {
          method: esNuevo ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } else {
        const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (item.id) {
          const idx = lista.findIndex((j) => j.id === item.id);
          if (idx !== -1) lista[idx] = item;
          else lista.push(item);
        } else {
          const nuevo = {
            ...item,
            id: crypto.randomUUID(),
            fechaRegistro: new Date().toISOString(),
            fechaActividad: new Date().toISOString(),
            activo: true,
          };
          lista.push(nuevo);
          localStorage.setItem(LS_KEY, JSON.stringify(lista));
          return nuevo;
        }
        localStorage.setItem(LS_KEY, JSON.stringify(lista));
        return item;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setCargando(false);
    }
  }, [modo]);

  const eliminarItem = useCallback(async (id) => {
    setCargando(true);
    setError(null);
    try {
      if (modo === 'api') {
        const res = await fetch(`${API_URL}/api/items/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        const lista = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        const actualizada = lista.map((j) =>
          j.id === id ? { ...j, activo: false } : j
        );
        localStorage.setItem(LS_KEY, JSON.stringify(actualizada));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [modo]);

  // Iniciar auto-guardado periódico (sin re-render con useRef)
  const iniciarAutoGuardado = useCallback((fn, ms = 30000) => {
    if (autoGuardadoRef.current) clearInterval(autoGuardadoRef.current);
    autoGuardadoRef.current = setInterval(fn, ms);
  }, []);

  const detenerAutoGuardado = useCallback(() => {
    if (autoGuardadoRef.current) {
      clearInterval(autoGuardadoRef.current);
      autoGuardadoRef.current = null;
    }
  }, []);

  return (
    <StorageContext.Provider
      value={{
        modo,
        setModo,
        cargando,
        error,
        obtenerItems,
        guardarItem,
        eliminarItem,
        iniciarAutoGuardado,
        detenerAutoGuardado,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}
