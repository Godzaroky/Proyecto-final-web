/**
 * App.jsx
 * Raíz de la aplicación.
 * - useState con lazy initializer (lee LocalStorage solo en el primer render)
 * - useEffect para sincronizar estado → LocalStorage en cada cambio
 */
import { useState, useEffect } from 'react';
import FormularioItem from './components/FormularioItem';
import ListaItems     from './components/ListaItems';

const STORAGE_KEY = 'vgt_items';

export default function App() {

  // Lazy initializer: JSON.parse solo ocurre en el primer render
  const [items, setItems] = useState(
    () => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  );

  const [itemEditar,        setItemEditar]        = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Sincronizar con LocalStorage cada vez que cambia items
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function handleGuardar(item) {
    if (itemEditar) {
      setItems(prev => prev.map(i => i.id === item.id ? item : i));
    } else {
      setItems(prev => [item, ...prev]);
    }
    setItemEditar(null);
    setMostrarFormulario(false);
  }

  function handleEditar(item) {
    setItemEditar(item);
    setMostrarFormulario(true);
  }

  function handleArchivar(id) {
    setItems(prev => prev.map(i =>
      i.id === id
        ? { ...i, activo: false, fechaActividad: new Date().toISOString() }
        : i
    ));
  }

  function handleNuevo() {
    setItemEditar(null);
    setMostrarFormulario(true);
  }

  function handleCancelar() {
    setItemEditar(null);
    setMostrarFormulario(false);
  }

  return (
    <div className="app">

      <div className="bg-grid"  aria-hidden />
      <div className="bg-glow"  aria-hidden />

      <header className="app-header">
        <div className="header-brand">
          <span className="brand-logo">◈</span>
          <div>
            <h1 className="brand-name">LEVELUP</h1>
            <p className="brand-sub">VIDEOGAME TRACKER // FASE 1</p>
          </div>
        </div>
        <button className="btn-nuevo" onClick={handleNuevo}>
          <span className="btn-nuevo-icon">+</span>
          AGREGAR JUEGO
        </button>
      </header>

      <main className="app-main">
        <ListaItems
          items={items}
          onEditar={handleEditar}
          onArchivar={handleArchivar}
        />
      </main>

      <footer className="app-footer">
        <span>STW-26 · UVG · {new Date().getFullYear()}</span>
        <span>FASE 1 — LocalStorage + React 18</span>
      </footer>

      {mostrarFormulario && (
        <FormularioItem
          itemEditar={itemEditar}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}

    </div>
  );
}