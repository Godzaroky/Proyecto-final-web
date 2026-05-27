/**
 * Categorías de videojuegos para el CRUD de colección personal.
 * Cada categoría tiene: id (slug), nombre, emoji y color hex para gráficas.
 */
export const CATEGORIAS = [
  { id: 'rpg',       nombre: 'RPG',       emoji: '🗡️',  color: '#7F77DD' },
  { id: 'accion',    nombre: 'Acción',    emoji: '💥',  color: '#E84040' },
  { id: 'estrategia',nombre: 'Estrategia',emoji: '♟️',  color: '#4CAF50' },
  { id: 'indie',     nombre: 'Indie',     emoji: '🎨',  color: '#FF9800' },
  { id: 'deportes',  nombre: 'Deportes',  emoji: '⚽',  color: '#2196F3' },
  { id: 'terror',    nombre: 'Terror',    emoji: '👻',  color: '#9C27B0' },
  { id: 'aventura',  nombre: 'Aventura',  emoji: '🗺️', color: '#00BCD4' },
];

export const ESTADOS = [
  { id: 'pendiente',   nombre: 'Por jugar',    emoji: '📋' },
  { id: 'jugando',     nombre: 'Jugando',       emoji: '🎮' },
  { id: 'completado',  nombre: 'Completado',    emoji: '✅' },
  { id: 'abandonado',  nombre: 'Abandonado',    emoji: '❌' },
  { id: 'platinado',   nombre: 'Platinado',     emoji: '🏆' },
];

export function getCategoriaById(id) {
  return CATEGORIAS.find((c) => c.id === id) || null;
}

export function getEstadoById(id) {
  return ESTADOS.find((e) => e.id === id) || null;
}
