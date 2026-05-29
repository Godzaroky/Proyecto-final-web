// src/components/GraficaCategorias.jsx
// Gráfica 2: Distribución de juegos por género — PieChart
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';
import { CATEGORIAS } from '../utils/categorias';

export default function GraficaCategorias({ items }) {
  const datos = useMemo(() => {
    return CATEGORIAS.map((cat) => ({
      name: `${cat.emoji} ${cat.nombre}`,
      value: items.filter((i) => i.categoriaId === cat.id && i.activo).length,
      color: cat.color,
    })).filter((d) => d.value > 0);
  }, [items]);

  if (datos.length === 0) {
    return (
      <div className="grafica-card">
        <h3 className="grafica-titulo">🎮 Juegos por género</h3>
        <p className="grafica-empty">Agrega juegos para ver la distribución</p>
      </div>
    );
  }

  return (
    <div className="grafica-card">
      <h3 className="grafica-titulo">🎮 Juegos por género</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={datos}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={75}
            label={({ name, percent }) =>
              `${(percent * 100).toFixed(0)}%`
            }
          >
            {datos.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--color-superficie)',
              border: '1px solid var(--color-borde)',
              color: 'var(--color-texto)',
              borderRadius: '8px',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
