// src/App.jsx
import { useReducer, useEffect, useMemo, useCallback, useContext } from 'react';
import { itemsReducer, estadoInicial } from './reducers/itemsReducer';
import { StorageContext } from './context/StorageContext';
import { ThemeContext } from './context/ThemeContext';
import FormularioItem from './components/FormularioItem';
import ListaItems from './components/ListaItems';
import FiltrosPanel from './components/FiltrosPanel';
import PanelGraficas from './components/PanelGraficas';

export default function App() {
  const { obtenerItems, guardarItem, eliminarItem, modo, setModo } =
    useContext(StorageContext);
  const { tema, toggleTema } = useContext(ThemeContext);

  const [estado, dispatch] = useReducer(itemsReducer, estadoInicial);

  // Cargar datos al montar (HIDRATAR)
  useEffect(() => {
    obtenerItems().then((items) => {
      dispatch({ type: 'HIDRATAR', payload: items });
    });
  }, [obtenerItems]);

  // Persistir lista cuando cambia
  useEffect(() => {
    if (modo === 'local') {
      localStorage.setItem('items', JSON.stringify(estado.lista));
    }
  }, [estado.lista, modo]);

  // useMemo: estadísticas generales (solo recalcula si lista cambia)
  const estadisticas = useMemo(() => {
    const activos = estado.lista.filter((j) => j.activo);
    return {
      total:      activos.length,
      completados: activos.filter((j) => j.estado === 'completado').length,
      jugando:    activos.filter((j) => j.estado === 'jugando').length,
      pendientes: activos.filter((j) => j.estado === 'pendiente').length,
      horasTotales: activos.reduce(
        (acc, j) => acc + (j.atributos?.horasTotales || 0),
        0
      ),
    };
  }, [estado.lista]);

  // useCallback: handler agregar — estable entre renders
  const handleAgregar = useCallback(
    async (nuevoJuego) => {
      dispatch({ type: 'AGREGAR', payload: nuevoJuego });
      await guardarItem(nuevoJuego);
    },
    [dispatch, guardarItem]
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-titulo">🎮 Mi Backlog</h1>
          <span className="app-subtitulo">Tracker de Videojuegos</span>
        </div>
        <div className="header-acciones">
          <button
            className="btn-modo"
            onClick={() => setModo(modo === 'api' ? 'local' : 'api')}
            title={`Modo actual: ${modo}`}
          >
            {modo === 'api' ? '☁️ API' : '💾 Local'}
          </button>
          <button className="btn-tema" onClick={toggleTema} title="Cambiar tema (T)">
            {tema === 'oscuro' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Estadísticas rápidas */}
      <section className="stats-bar">
        <div className="stat-item">
          <span className="stat-num">{estadisticas.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{estadisticas.jugando}</span>
          <span className="stat-label">🎮 Jugando</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{estadisticas.completados}</span>
          <span className="stat-label">✅ Completados</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{estadisticas.pendientes}</span>
          <span className="stat-label">📋 Pendientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-num">{estadisticas.horasTotales}h</span>
          <span className="stat-label">⏱️ Horas totales</span>
        </div>
      </section>

      <main className="app-main">
        {/* Panel izquierdo: formulario + filtros + lista */}
        <div className="panel-principal">
          <FormularioItem onAgregar={handleAgregar} />
          <FiltrosPanel estado={estado} dispatch={dispatch} />
          <ListaItems estado={estado} dispatch={dispatch} />
        </div>

        {/* Panel derecho: gráficas */}
        <aside className="panel-graficas-aside">
          <PanelGraficas items={estado.lista} />
        </aside>
      </main>
    </div>
  );
}
