// src/reducers/itemsReducer.js
// ⚠️ Función PURA: sin fetch, sin Date.now(), sin mutaciones al estado anterior.

export const estadoInicial = {
  lista:           [],       // array de Items (juegos)
  filtroCategoria: 'todas',  // slug del género
  filtroEstado:    'todos',  // pendiente | jugando | completado | abandonado
  busqueda:        '',       // texto de búsqueda por nombre
};

export function itemsReducer(estado, accion) {
  switch (accion.type) {

    // Carga inicial desde API o LocalStorage
    case 'HIDRATAR':
      return { ...estado, lista: accion.payload };

    // Añade un nuevo juego al array
    case 'AGREGAR':
      return { ...estado, lista: [...estado.lista, accion.payload] };

    // Archiva el juego (activo = false) — no borra de BD
    case 'ELIMINAR':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload ? { ...item, activo: false } : item
        ),
      };

    // Editar campos de un juego existente
    case 'EDITAR':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.id
            ? { ...item, ...accion.payload.cambios }
            : item
        ),
      };

    // Cambia el estado (pendiente → jugando → completado → abandonado)
    case 'CAMBIAR_ESTADO':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.id
            ? { ...item, estado: accion.payload.estado }
            : item
        ),
      };

    // Actualiza un filtro por nombre de campo (filtroCategoria, filtroEstado, busqueda)
    case 'FILTRAR':
      return {
        ...estado,
        [accion.payload.campo]: accion.payload.valor,
      };

    // Resetea todos los filtros a su valor inicial
    case 'LIMPIAR_FILTROS':
      return {
        ...estado,
        filtroCategoria: 'todas',
        filtroEstado:    'todos',
        busqueda:        '',
      };

    // Agrega un registro de actividad (horas jugadas) al historial del juego
    case 'REGISTRAR_ACTIVIDAD':
      return {
        ...estado,
        lista: estado.lista.map(item =>
          item.id === accion.payload.itemId
            ? {
                ...item,
                fechaActividad: accion.payload.fecha,
                atributos: {
                  ...item.atributos,
                  horasTotales:
                    (item.atributos?.horasTotales || 0) + accion.payload.valor,
                },
              }
            : item
        ),
      };

    default:
      throw new Error(`Acción desconocida: ${accion.type}`);
  }
}
