import { useEffect } from 'react';

/**
 * Registra un atajo de teclado global con limpieza automática.
 * Ignora las pulsaciones cuando el foco está dentro de un input o
 * textarea para no interferir con la escritura del usuario.
 *
 * @param {string} tecla - Tecla a escuchar, ej. 'n', 't', 'k'.
 * @param {Function} onPress - Callback que se ejecuta al activarse.
 * @param {{ctrl?: boolean}} [opciones] - Si ctrl=true exige Ctrl presionado.
 * @returns {void}
 */
export function useAtajoTeclado(tecla, onPress, { ctrl = false } = {}) {
  useEffect(() => {
    const handler = (e) => {
      const enInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      if (enInput) return;
      if (ctrl && !e.ctrlKey) return;
      if (e.key.toLowerCase() !== tecla.toLowerCase()) return;
      e.preventDefault();
      onPress(e);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tecla, onPress, ctrl]);
}
