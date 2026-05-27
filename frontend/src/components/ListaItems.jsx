import { useState, useEffect, useRef } from 'react';
import { useStorage } from '../context/StorageContext';
import { CATEGORIAS, ESTADOS } from '../utils/categorias';
import ItemCard from './ItemCard';

/**
 * useRef aplicado para scroll automático al último juego añadido.
 * lastItemRef.current.scrollIntoView() se llama cuando la lista cambia.
 */
export default function ListaItems({ refrescador }) {
  const { obtenerItems, cargando, error } = useStorage();
  const [juegos, setJuegos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  // useRef para scroll al último elemento de la lista
  const lastItemRef = useRef(null);
  const prevLengthRef = useRef(0);

  const cargar = async () => {
    const lista = await obtenerItems();
    setJuegos(lista.filter((j) => j.activo !== false && j.activo !== 0));
  };

  useEffect(() => {
    cargar();
  }, [refrescador]);

  // Scroll automático cuando se agrega un juego nuevo
  useEffect(() => {
    if (juegos.length > prevLengthRef.current && lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    prevLengthRef.current = juegos.length;
  }, [juegos.length]);

  const juegosFiltrados = juegos.filter((j) => {
    const coincideCategoria =
      filtroCategoria === 'todas' || j.categoriaId === filtroCategoria;
    const coincideEstado =
      filtroEstado === 'todos' || j.estado === filtroEstado;
    const coincideBusqueda =
      !busqueda || j.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideEstado && coincideBusqueda;
  });

  return (
    <section className="lista-items">
      <div className="lista-header">
        <h2>🎮 Mi Colección ({juegosFiltrados.length})</h2>

        <div className="filtros">
          <input
            type="search"
            placeholder="🔍 Buscar juego…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />

          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="todas">Todos los géneros</option>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.emoji} {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          ⚠️ Error: {error}. Verifica que el backend esté corriendo.
        </div>
      )}

      {cargando && <div className="spinner">Cargando juegos…</div>}

      {!cargando && juegosFiltrados.length === 0 && (
        <div className="lista-vacia">
          <p>No hay juegos que coincidan con los filtros.</p>
          {juegos.length === 0 && (
            <p>¡Agrega tu primer juego arriba! 🚀</p>
          )}
        </div>
      )}

      <div className="cards-grid">
        {juegosFiltrados.map((juego, idx) => (
          <div
            key={juego.id}
            ref={idx === juegosFiltrados.length - 1 ? lastItemRef : null}
          >
            <ItemCard juego={juego} onActualizado={cargar} />
          </div>
        ))}
      </div>
    </section>
  );
}
