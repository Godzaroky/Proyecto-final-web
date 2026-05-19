/**
 * ListaItems.jsx
 * Lista filtrable y ordenable de videojuegos.
 * Props:
 *   items      — Item[]
 *   onEditar   — fn(item) => void
 *   onArchivar — fn(id: string) => void
 */
import { useState } from 'react';
import ItemCard from './ItemCard';
import { CATEGORIAS, ESTADOS } from '../utils/itemFactory';

export default function ListaItems({ items, onEditar, onArchivar }) {
  const [busqueda,        setBusqueda]        = useState('');
  const [filtroEstado,    setFiltroEstado]    = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [verArchivados,   setVerArchivados]   = useState(false);

  const activos    = items.filter(i => i.activo);
  const archivados = items.filter(i => !i.activo);

  const base = verArchivados ? archivados : activos;

  const visibles = base.filter(item => {
    const q   = busqueda.toLowerCase();
    const ok1 = !q || item.nombre.toLowerCase().includes(q) ||
                (item.atributos?.desarrollador ?? '').toLowerCase().includes(q);
    const ok2 = filtroEstado    === 'todos' || item.estado      === filtroEstado;
    const ok3 = filtroCategoria === 'todas' || item.categoriaId === filtroCategoria;
    return ok1 && ok2 && ok3;
  });

  const stats = {
    jugando:    activos.filter(i => i.estado === 'jugando').length,
    completado: activos.filter(i => i.estado === 'completado').length,
    pendiente:  activos.filter(i => i.estado === 'pendiente').length,
  };

  return (
    <section className="lista">

      <div className="stats-bar">
        <div className="stat-chip stat-jugando">
          <span className="stat-num">{stats.jugando}</span>
          <span className="stat-lbl">JUGANDO</span>
        </div>
        <div className="stat-chip stat-completado">
          <span className="stat-num">{stats.completado}</span>
          <span className="stat-lbl">COMPLETADOS</span>
        </div>
        <div className="stat-chip stat-pendiente">
          <span className="stat-num">{stats.pendiente}</span>
          <span className="stat-lbl">PENDIENTES</span>
        </div>
        <div className="stat-chip stat-total">
          <span className="stat-num">{activos.length}</span>
          <span className="stat-lbl">EN BIBLIOTECA</span>
        </div>
      </div>

      <div className="controles">
        <input
          className="ctrl-busqueda"
          type="search"
          placeholder="// buscar juego o estudio..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <select className="ctrl-select" value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}>
          <option value="todos">TODOS LOS ESTADOS</option>
          {ESTADOS.map(s => (
            <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>
          ))}
        </select>
        <select className="ctrl-select" value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}>
          <option value="todas">TODOS LOS GÉNEROS</option>
          {CATEGORIAS.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
          ))}
        </select>
        {archivados.length > 0 && (
          <button
            className={`ctrl-toggle ${verArchivados ? 'active' : ''}`}
            onClick={() => setVerArchivados(v => !v)}
          >
            {verArchivados ? 'VER ACTIVOS' : `ARCHIVADOS (${archivados.length})`}
          </button>
        )}
      </div>

      <div className="lista-titulo">
        <span className="lista-label">
          {verArchivados ? '// ARCHIVADOS' : '// BIBLIOTECA'}
        </span>
        <span className="lista-count">
          {visibles.length} resultado{visibles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {visibles.length === 0 ? (
        <div className="lista-vacia">
          <p className="vacia-icon">◈</p>
          <p className="vacia-msg">
            {busqueda || filtroEstado !== 'todos' || filtroCategoria !== 'todas'
              ? 'Sin resultados para esos filtros.'
              : verArchivados
                ? 'No hay juegos archivados.'
                : 'Tu biblioteca está vacía. ¡Agrega tu primer juego!'}
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {visibles.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEditar={onEditar}
              onArchivar={onArchivar}
            />
          ))}
        </div>
      )}

    </section>
  );
}