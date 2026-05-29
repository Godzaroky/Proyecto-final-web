// src/components/FiltrosPanel.jsx
import { CATEGORIAS } from '../utils/categorias';

const ESTADOS = [
  { id: 'todos',      label: 'Todos los estados' },
  { id: 'pendiente',  label: '📋 Pendiente' },
  { id: 'jugando',    label: '🎮 Jugando' },
  { id: 'completado', label: '✅ Completado' },
  { id: 'abandonado', label: '❌ Abandonado' },
];

export default function FiltrosPanel({ estado, dispatch }) {
  const { filtroCategoria, filtroEstado, busqueda } = estado;

  const hayFiltrosActivos =
    filtroCategoria !== 'todas' ||
    filtroEstado !== 'todos' ||
    busqueda !== '';

  function setFiltro(campo, valor) {
    dispatch({ type: 'FILTRAR', payload: { campo, valor } });
  }

  return (
    <div className="filtros-panel">
      {/* Búsqueda por nombre */}
      <input
        className="filtro-input"
        type="text"
        placeholder="🔍 Buscar juego..."
        value={busqueda}
        onChange={(e) => setFiltro('busqueda', e.target.value)}
      />

      {/* Filtro por género */}
      <select
        className="filtro-select"
        value={filtroCategoria}
        onChange={(e) => setFiltro('filtroCategoria', e.target.value)}
      >
        <option value="todas">🎯 Todos los géneros</option>
        {CATEGORIAS.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.emoji} {cat.nombre}
          </option>
        ))}
      </select>

      {/* Filtro por estado */}
      <select
        className="filtro-select"
        value={filtroEstado}
        onChange={(e) => setFiltro('filtroEstado', e.target.value)}
      >
        {ESTADOS.map((est) => (
          <option key={est.id} value={est.id}>
            {est.label}
          </option>
        ))}
      </select>

      {/* Limpiar filtros */}
      {hayFiltrosActivos && (
        <button
          className="btn-limpiar"
          onClick={() => dispatch({ type: 'LIMPIAR_FILTROS' })}
        >
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  );
}
