// src/components/BuscadorRAWG.jsx
import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';

// Tu API key de RAWG. Regístrate gratis en https://rawg.io/apidocs
// Para producción, muévela a una variable de entorno (VITE_RAWG_KEY).
const RAWG_KEY = import.meta.env.VITE_RAWG_KEY || '';

/**
 * Buscador opcional contra la API pública de RAWG.io.
 * Permite buscar un juego real y autocompletar su nombre en el backlog.
 * Demuestra el hook useFetch con sus estados data / cargando / error.
 */
export default function BuscadorRAWG({ onSeleccionar }) {
  const [termino, setTermino] = useState('');
  const [consulta, setConsulta] = useState('');

  // Solo se arma la URL cuando hay una consulta confirmada.
  const url = consulta
    ? `https://api.rawg.io/api/games?search=${encodeURIComponent(consulta)}&page_size=5&key=${RAWG_KEY}`
    : '';

  const { data, cargando, error } = useFetch(url);

  function buscar(e) {
    e.preventDefault();
    if (termino.trim().length >= 2) setConsulta(termino.trim());
  }

  return (
    <div className="buscador-rawg">
      <form className="form-fila" onSubmit={buscar}>
        <input
          className="form-input"
          type="text"
          placeholder="Buscar juego en RAWG..."
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
        />
        <button className="btn-agregar" type="submit">🔍 Buscar</button>
      </form>

      {cargando && <p className="rawg-estado">Buscando...</p>}
      {error && <p className="rawg-estado rawg-error">Error: {error}</p>}

      {data?.results?.length > 0 && (
        <ul className="rawg-resultados">
          {data.results.map((juego) => (
            <li key={juego.id}>
              <button
                type="button"
                className="rawg-item"
                onClick={() => onSeleccionar?.(juego.name)}
              >
                {juego.name}
                {juego.released ? ` (${juego.released.slice(0, 4)})` : ''}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
