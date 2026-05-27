import { useStorage } from '../context/StorageContext';
import { getCategoriaById, getEstadoById } from '../utils/categorias';

export default function ItemCard({ juego, onActualizado }) {
  const { guardarItem, eliminarItem, cargando } = useStorage();

  const categoria = getCategoriaById(juego.categoriaId);
  const estado = getEstadoById(juego.estado);

  const handleEliminar = async () => {
    if (!window.confirm(`¿Archivar "${juego.nombre}"?`)) return;
    await eliminarItem(juego.id);
    onActualizado?.();
  };

  const handleCambiarEstado = async (nuevoEstado) => {
    await guardarItem({ ...juego, estado: nuevoEstado });
    onActualizado?.();
  };

  return (
    <article
      className="item-card"
      style={{ borderLeft: `4px solid ${categoria?.color || '#888'}` }}
    >
      <header className="card-header">
        <span className="card-emoji">{categoria?.emoji || '🎮'}</span>
        <div>
          <h3 className="card-titulo">{juego.nombre}</h3>
          <span
            className="card-categoria"
            style={{ color: categoria?.color }}
          >
            {categoria?.nombre}
          </span>
        </div>
        <span className="card-estado-badge">
          {estado?.emoji} {estado?.nombre}
        </span>
      </header>

      <div className="card-atributos">
        {juego.atributos?.plataforma && (
          <span className="attr-chip">🖥 {juego.atributos.plataforma}</span>
        )}
        {juego.atributos?.horasTotales > 0 && (
          <span className="attr-chip">⏱ {juego.atributos.horasTotales}h</span>
        )}
        {juego.atributos?.desarrollador && (
          <span className="attr-chip">🏢 {juego.atributos.desarrollador}</span>
        )}
        {juego.puntuacion != null && (
          <span className="attr-chip">⭐ {juego.puntuacion}/10</span>
        )}
      </div>

      {juego.notas && <p className="card-notas">{juego.notas}</p>}

      <footer className="card-footer">
        <select
          value={juego.estado}
          onChange={(e) => handleCambiarEstado(e.target.value)}
          disabled={cargando}
          className="select-estado"
        >
          {['pendiente', 'jugando', 'completado', 'abandonado', 'platinado'].map(
            (e) => (
              <option key={e} value={e}>
                {getEstadoById(e)?.emoji} {getEstadoById(e)?.nombre}
              </option>
            )
          )}
        </select>
        <button
          className="btn-danger"
          onClick={handleEliminar}
          disabled={cargando}
        >
          🗑 Archivar
        </button>
      </footer>
    </article>
  );
}
