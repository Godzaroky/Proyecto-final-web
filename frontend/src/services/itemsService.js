/**
 * services/itemsService.js
 * Capa de acceso a LocalStorage para los items.
 * En Fase 2 este archivo se reemplaza por llamadas fetch al backend.
 */

const KEY = 'vgt_items';

/** Lee el arreglo completo desde LocalStorage. */
export function leerItems() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Sobreescribe el arreglo completo en LocalStorage. */
export function guardarItems(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}