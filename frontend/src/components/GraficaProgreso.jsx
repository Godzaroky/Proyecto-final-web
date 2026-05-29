// src/components/GraficaProgreso.jsx
// Gráfica 3 — ORIGINAL: Progreso % de juegos completados por mes (LineChart)
// Muestra la evolución mensual de juegos completados vs total registrado.
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useMemo } from 'react';

export default function GraficaProgreso({ items }) {
  const datos = useMemo(() => {
    // Últimos 6 meses
    const meses = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return {
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
        label: d.toLocaleDateString('es', { month: 'short', year: '2-digit' }),
      };
    });

    return meses.map(({ key, label }) => {
      // Juegos registrados hasta ese mes (inclusive)
      const registradosHasta = items.filter(
        (j) => j.activo && j.fechaRegistro?.slice(0, 7) <= key
      );
      const completadosHasta = registradosHasta.filter(
        (j) => j.estado === 'completado'
      );
      const porcentaje =
        registradosHasta.length > 0
          ? Math.round((completadosHasta.length / registradosHasta.length) * 100)
          : 0;

      return {
        mes: label,
        '% Completados': porcentaje,
        Total: registradosHasta.length,
      };
    });
  }, [items]);

  return (
    <div className="grafica-card">
      <h3 className="grafica-titulo">📈 Progreso de completados por mes</h3>
      <p className="grafica-subtitulo">
        % de juegos completados sobre el total registrado (últimos 6 meses)
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={datos} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-borde)" />
          <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
          <YAxis
            yAxisId="pct"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            yAxisId="tot"
            orientation="right"
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value, name) =>
              name === '% Completados' ? `${value}%` : value
            }
            contentStyle={{
              background: 'var(--color-superficie)',
              border: '1px solid var(--color-borde)',
              color: 'var(--color-texto)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            yAxisId="pct"
            type="monotone"
            dataKey="% Completados"
            stroke="var(--color-acento)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="tot"
            type="monotone"
            dataKey="Total"
            stroke="var(--color-acento-2)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
