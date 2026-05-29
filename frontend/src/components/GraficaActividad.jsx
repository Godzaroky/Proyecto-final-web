// src/components/GraficaActividad.jsx
// Gráfica 1: Actividad de los últimos 7 días — BarChart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

export default function GraficaActividad({ items }) {
  const datos = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dia = d.toISOString().split('T')[0];
      const juegosActivos = items.filter(
        (item) => item.activo && item.fechaActividad?.startsWith(dia)
      );
      return {
        fecha: d.toLocaleDateString('es', { weekday: 'short', day: 'numeric' }),
        juegos: juegosActivos.length,
        horas: juegosActivos.reduce(
          (acc, j) => acc + (j.atributos?.horasTotales || 0),
          0
        ),
      };
    });
  }, [items]);

  return (
    <div className="grafica-card">
      <h3 className="grafica-titulo">🗓️ Actividad últimos 7 días</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datos} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-superficie)',
              border: '1px solid var(--color-borde)',
              color: 'var(--color-texto)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Bar
            dataKey="juegos"
            name="Juegos activos"
            fill="var(--color-acento)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
