// src/components/ItemCard.jsx
// React.memo: solo re-renderiza si sus props cambian
import { memo } from 'react';
import { CATEGORIAS } from '../utils/categorias';

const ESTADO_CONFIG = {
  pendiente:  { emoji: '📋', label: 'Pendiente',  clase: 'estado-pendiente' },
  jugando:    { emoji: '🎮', label: 'Jugando',    clase: 'estado-jugando' },
  completado: { emoji: '✅', label: 'Completado', clase: 'estado-completado' },
  abandonado: { emoji: '❌', label: 'Abandonado', clase: 'estado-abandonado' },
};

const ESTADOS_SIGUIENTES = {
  pendiente:  ['jugando', 'abandonado'],
  jugando:    ['completado', 'abandonado'],
  completado: ['jugando'],
  abandonado: ['pendiente'],
};

function ItemCard({ item, onEliminar, onCambiarEstado }) {
  const categoria = CATEGORIAS.find((c) => c.id === item.categoriaId);
  const estadoConf = ESTADO_CONFIG[item.estado] || ESTADO_CONFIG.pendiente;
  const siguientes = ESTADOS_SIGUIENTES[item.estado] || [];

  return (
    <article className="item-card">
      {/* Header */}
      <div className="card-header">
        <span
          className="card-categoria"
          style={{ backgroundColor: categoria?.color + '33', color: categoria?.color }}
        >
          {categoria?.emoji} {categoria?.nombre}
        </span>
        <span className={`card-estado ${estadoConf.clase}`}>
          {estadoConf.emoji} {estadoConf.label}
        </span>
      </div>

      {/* Nombre y puntuación */}
      <h3 className="card-nombre">{item.nombre}</h3>
      {item.puntuacion !== null && item.puntuacion !== undefined && (
        <div className="card-puntuacion">
          {'⭐'.repeat(Math.round(item.puntuacion / 2))} {item.puntuacion}/10
        </div>
      )}

      {/* Atributos específicos del tema */}
      <div className="card-atributos">
        {item.atributos?.plataforma && (
          <span className="atributo-tag">🖥️ {item.atributos.plataforma}</span>
        )}
        {item.atributos?.horasTotales > 0 && (
          <span className="atributo-tag">⏱️ {item.atributos.horasTotales}h</span>
        )}
        {item.atributos?.desarrollador && (
          <span className="atributo-tag">🏢 {item.atributos.desarrollador}</span>
        )}
      </div>

      {/* Notas */}
      {item.notas && <p className="card-notas">{item.notas}</p>}

      {/* Acciones */}
      <div className="card-acciones">
        {siguientes.map((sig) => (
          <button
            key={sig}
            className="btn-estado"
            onClick={() => onCambiarEstado(item.id, sig)}
          >
            {ESTADO_CONFIG[sig].emoji} {ESTADO_CONFIG[sig].label}
          </button>
        ))}
        <button
          className="btn-eliminar"
          onClick={() => onEliminar(item.id)}
          title="Archivar juego"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}

export default memo(ItemCard);
