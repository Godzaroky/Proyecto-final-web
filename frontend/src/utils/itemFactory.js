/**
 * utils/itemFactory.js
 * Fábrica de items y constantes del dominio "videojuegos".
 */

export const CATEGORIAS = [
  { id: 'rpg',         label: 'RPG',        icon: '⚔️'  },
  { id: 'accion',      label: 'Acción',      icon: '💥'  },
  { id: 'aventura',    label: 'Aventura',    icon: '🗺️'  },
  { id: 'estrategia',  label: 'Estrategia',  icon: '🧠'  },
  { id: 'simulacion',  label: 'Simulación',  icon: '🎮'  },
  { id: 'plataformas', label: 'Plataformas', icon: '🏃'  },
  { id: 'terror',      label: 'Terror',      icon: '👻'  },
  { id: 'deportes',    label: 'Deportes',    icon: '⚽'  },
  { id: 'peleas',      label: 'Peleas',      icon: '🥊'  },
  { id: 'puzzle',      label: 'Puzzle',      icon: '🧩'  },
];

export const ESTADOS = [
  { id: 'pendiente',  label: 'Pendiente',  color: '#facc15' },
  { id: 'jugando',    label: 'Jugando',    color: '#22d3ee' },
  { id: 'completado', label: 'Completado', color: '#4ade80' },
  { id: 'abandonado', label: 'Abandonado', color: '#f87171' },
];

export const PLATAFORMAS = [
  'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X',
  'Nintendo Switch', 'Mobile', 'Arcade', 'Retro',
];

/**
 * Crea un item nuevo con todos los campos requeridos por la rúbrica.
 * @param {Partial<Item>} overrides
 * @returns {Item}
 */
export function crearItem(overrides = {}) {
  const now = new Date().toISOString();
  return {
    id:             crypto.randomUUID(),
    nombre:         '',
    categoriaId:    'rpg',
    estado:         'pendiente',
    puntuacion:     null,
    fechaRegistro:  now,
    fechaActividad: now,
    notas:          '',
    atributos: {
      plataforma:    'PC',
      desarrollador: '',
      horasJugadas:  0,
      multijugador:  false,
    },
    activo: true,
    ...overrides,
  };
}

export function getCategoria(id) {
  return CATEGORIAS.find(c => c.id === id) ?? { id, label: id, icon: '🎮' };
}

export function getEstado(id) {
  return ESTADOS.find(e => e.id === id) ?? { id, label: id, color: '#94a3b8' };
}

export function formatFecha(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-GT', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}