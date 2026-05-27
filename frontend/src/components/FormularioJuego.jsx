import { useState, useRef, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { CATEGORIAS, ESTADOS } from '../utils/categorias';

/**
 * useRef #1: enfoca el input de nombre automáticamente después de agregar un juego.
 * El ref se pasa al <input> y se llama .focus() tras el submit exitoso.
 */
export default function FormularioJuego({ onJuegoAgregado }) {
  const { guardarItem, cargando } = useStorage();
  const inputNombreRef = useRef(null); // ← useRef #1: foco en input

  const [form, setForm] = useState({
    nombre: '',
    categoriaId: 'rpg',
    estado: 'pendiente',
    puntuacion: '',
    notas: '',
    atributos: { plataforma: '', horasTotales: 0, desarrollador: '' },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('attr_')) {
      const key = name.replace('attr_', '');
      setForm((prev) => ({
        ...prev,
        atributos: { ...prev.atributos, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || form.nombre.trim().length < 2) return;

    const nuevoJuego = {
      nombre: form.nombre.trim(),
      categoriaId: form.categoriaId,
      estado: form.estado,
      puntuacion: form.puntuacion ? parseFloat(form.puntuacion) : null,
      notas: form.notas,
      atributos: {
        plataforma: form.atributos.plataforma,
        horasTotales: parseFloat(form.atributos.horasTotales) || 0,
        desarrollador: form.atributos.desarrollador,
      },
    };

    const guardado = await guardarItem(nuevoJuego);
    if (guardado) {
      setForm({
        nombre: '',
        categoriaId: 'rpg',
        estado: 'pendiente',
        puntuacion: '',
        notas: '',
        atributos: { plataforma: '', horasTotales: 0, desarrollador: '' },
      });
      // useRef #1: enfocar el campo nombre después de agregar
      inputNombreRef.current?.focus();
      onJuegoAgregado?.();
    }
  };

  return (
    <form className="formulario-juego" onSubmit={handleSubmit}>
      <h2>➕ Agregar Juego</h2>

      <div className="form-group">
        <label htmlFor="nombre">Nombre del juego *</label>
        <input
          ref={inputNombreRef}       // ← useRef #1 aplicado aquí
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: The Legend of Zelda"
          required
          minLength={2}
          autoFocus
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="categoriaId">Género</label>
          <select id="categoriaId" name="categoriaId" value={form.categoriaId} onChange={handleChange}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji} {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
            {ESTADOS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.emoji} {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="attr_plataforma">Plataforma</label>
          <input
            id="attr_plataforma"
            name="attr_plataforma"
            type="text"
            value={form.atributos.plataforma}
            onChange={handleChange}
            placeholder="PC, PS5, Switch…"
          />
        </div>

        <div className="form-group">
          <label htmlFor="attr_horasTotales">Horas jugadas</label>
          <input
            id="attr_horasTotales"
            name="attr_horasTotales"
            type="number"
            min="0"
            value={form.atributos.horasTotales}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="attr_desarrollador">Desarrollador</label>
          <input
            id="attr_desarrollador"
            name="attr_desarrollador"
            type="text"
            value={form.atributos.desarrollador}
            onChange={handleChange}
            placeholder="Nintendo, Valve…"
          />
        </div>

        <div className="form-group">
          <label htmlFor="puntuacion">Puntuación (0–10)</label>
          <input
            id="puntuacion"
            name="puntuacion"
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={form.puntuacion}
            onChange={handleChange}
            placeholder="—"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notas">Notas</label>
        <textarea
          id="notas"
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={2}
          placeholder="Impresiones, progreso, comentarios…"
        />
      </div>

      <button type="submit" className="btn-primary" disabled={cargando}>
        {cargando ? 'Guardando…' : '🎮 Agregar juego'}
      </button>

      <p className="atajo-hint">
        <kbd>Ctrl</kbd>+<kbd>N</kbd> para enfocar este campo desde cualquier lugar
      </p>
    </form>
  );
}
