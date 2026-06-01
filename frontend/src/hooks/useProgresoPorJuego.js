import { useMemo } from 'react';

/**
 * Calcula estadísticas de progreso del backlog de videojuegos.
 * Deriva totales por estado, porcentaje de completados y horas
 * acumuladas a partir de los atributos de cada juego.
 *
 * Es una función pura memoizada: solo recalcula si cambia la lista.
 *
 * @param {Array<Object>} juegos - Lista de juegos (estado.lista).
 * @returns {{
 *   total: number,
 *   completados: number,
 *   jugando: number,
 *   pendientes: number,
 *   porcentajeCompletado: number,
 *   horasTotales: number
 * }}
 */
export function useProgresoPorJuego(juegos = []) {
  return useMemo(() => {
    const activos = juegos.filter((j) => j.activo);
    const total = activos.length;

    const completados = activos.filter((j) => j.estado === 'completado').length;
    const jugando = activos.filter((j) => j.estado === 'jugando').length;
    const pendientes = activos.filter((j) => j.estado === 'pendiente').length;

    const porcentajeCompletado =
      total === 0 ? 0 : Math.round((completados / total) * 100);

    // Suma las horas guardadas en atributos.horasTotales de cada juego.
    const horasTotales = activos.reduce(
      (acc, j) => acc + (Number(j.atributos?.horasTotales) || 0),
      0
    );

    return {
      total,
      completados,
      jugando,
      pendientes,
      porcentajeCompletado,
      horasTotales,
    };
  }, [juegos]);
}
