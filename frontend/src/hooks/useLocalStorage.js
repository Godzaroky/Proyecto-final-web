import { useState, useEffect } from 'react';

/**
 * Sincroniza un estado de React con localStorage.
 * Lee el valor guardado al montar (lazy initializer) y lo reescribe
 * cada vez que cambia. Si el JSON está corrupto, cae al valor inicial.
 *
 * @param {string} clave - Clave bajo la que se guarda en localStorage.
 * @param {*} valorInicial - Valor por defecto si no hay nada guardado.
 * @returns {[*, Function]} Par [valor, setValor] igual que useState.
 */
export function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado !== null ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      console.warn(`useLocalStorage: no se pudo guardar "${clave}"`, e);
    }
  }, [clave, valor]);

  return [valor, setValor];
}
