// src/components/ListaItems.jsx
import { useMemo, useCallback } from 'react';
import ItemCard from "./ItemCard.jsx";

export default function ListaItems({ estado, dispatch }) {
  const { lista, filtroCategoria, filtroEstado, busqueda } = estado;

  // useMemo: solo recalcula si cambian lista o filtros
  const itemsVisibles = useMemo(() => {
    let res = lista.filter((i) => i.activo);

    if (busqueda.trim()) {
      res = res.filter((i) =>
        i.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    if (filtroCategoria !== 'todas') {
      res = res.filter((i) => i.categoriaId === filtroCategoria);
    }
    if (filtroEstado !== 'todos') {
      res = res.filter((i) => i.estado === filtroEstado);
    }

    return res;
  }, [lista, busqueda, filtroCategoria, filtroEstado]);

  // useCallback: handlers estables para que ItemCard (memo) no re-renderice
  const handleEliminar = useCallback(
    (id) => dispatch({ type: 'ELIMINAR', payload: id }),
    [dispatch]
  );

  const handleCambiarEstado = useCallback(
    (id, nuevoEstado) =>
      dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado: nuevoEstado } }),
    [dispatch]
  );

  if (itemsVisibles.length === 0) {
    return (
      <div className="lista-vacia">
        <p>🎮 No hay juegos que coincidan con los filtros.</p>
      </div>
    );
  }

  return (
    <div className="lista-items">
      <p className="lista-conteo">
        {itemsVisibles.length} juego{itemsVisibles.length !== 1 ? 's' : ''}
      </p>
      <div className="items-grid">
        {itemsVisibles.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onEliminar={handleEliminar}
            onCambiarEstado={handleCambiarEstado}
          />
        ))}
      </div>
    </div>
  );
}
