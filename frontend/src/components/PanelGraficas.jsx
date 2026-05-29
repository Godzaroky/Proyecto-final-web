// src/components/PanelGraficas.jsx
import GraficaActividad from './GraficaActividad';
import GraficaCategorias from './GraficaCategorias';
import GraficaProgreso from './GraficaProgreso';

export default function PanelGraficas({ items }) {
  return (
    <section className="panel-graficas">
      <h2 className="seccion-titulo">📊 Estadísticas de tu Backlog</h2>
      <div className="graficas-grid">
        <GraficaActividad items={items} />
        <GraficaCategorias items={items} />
        <GraficaProgreso items={items} />
      </div>
    </section>
  );
}
