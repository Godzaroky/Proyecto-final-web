/**
 * FormularioItem.jsx
 * Formulario controlado con useState para crear o editar un videojuego.
 * Props:
 *   itemEditar  — Item | null  (null = modo creación)
 *   onGuardar   — fn(item) => void
 *   onCancelar  — fn() => void
 */
import { useState } from 'react';
import { crearItem, CATEGORIAS, ESTADOS, PLATAFORMAS } from '../utils/itemFactory';

const VACIO = {
  nombre: '', categoriaId: 'rpg', estado: 'pendiente',
  puntuacion: '', notas: '',
  plataforma: 'PC', desarrollador: '', horasJugadas: '', multijugador: false,
};

function camposDeItem(item) {
  return {
    nombre:        item.nombre,
    categoriaId:   item.categoriaId,
    estado:        item.estado,
    puntuacion:    item.puntuacion ?? '',
    notas:         item.notas,
    plataforma:    item.atributos?.plataforma    ?? 'PC',
    desarrollador: item.atributos?.desarrollador ?? '',
    horasJugadas:  item.atributos?.horasJugadas  ?? '',
    multijugador:  item.atributos?.multijugador  ?? false,
  };
}

export default function FormularioItem({ itemEditar, onGuardar, onCancelar }) {
  const esEdicion = Boolean(itemEditar);
  const [form, setForm] = useState(() => esEdicion ? camposDeItem(itemEditar) : VACIO);
  const [error, setError] = useState('');

  function handle(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre del juego es obligatorio.'); return; }
    setError('');

    const puntuacion = form.puntuacion === '' ? null : Number(form.puntuacion);
    const atributos  = {
      plataforma:    form.plataforma,
      desarrollador: form.desarrollador,
      horasJugadas:  Number(form.horasJugadas) || 0,
      multijugador:  form.multijugador,
    };

    if (esEdicion) {
      onGuardar({
        ...itemEditar,
        nombre:         form.nombre.trim(),
        categoriaId:    form.categoriaId,
        estado:         form.estado,
        puntuacion,
        notas:          form.notas,
        fechaActividad: new Date().toISOString(),
        atributos,
      });
    } else {
      onGuardar(crearItem({
        nombre:      form.nombre.trim(),
        categoriaId: form.categoriaId,
        estado:      form.estado,
        puntuacion,
        notas:       form.notas,
        atributos,
      }));
      setForm(VACIO);
    }
  }

  return (
    <div className="form-overlay">
      <form className="form-panel" onSubmit={submit} noValidate>

        <div className="form-header">
          <span className="form-tag">// {esEdicion ? 'EDITAR' : 'NUEVO'}_JUEGO</span>
          <button type="button" className="form-close" onClick={onCancelar}>✕</button>
        </div>

        {error && <p className="form-error">⚠ {error}</p>}

        <div className="field field-full">
          <label className="field-label">NOMBRE DEL JUEGO *</label>
          <input className="field-input" name="nombre" value={form.nombre}
            onChange={handle} placeholder="ej. Elden Ring" autoComplete="off" autoFocus />
        </div>

        <div className="form-row">
          <div className="field">
            <label className="field-label">GÉNERO</label>
            <select className="field-input" name="categoriaId" value={form.categoriaId} onChange={handle}>
              {CATEGORIAS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">ESTADO</label>
            <select className="field-input" name="estado" value={form.estado} onChange={handle}>
              {ESTADOS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">PLATAFORMA</label>
            <select className="field-input" name="plataforma" value={form.plataforma} onChange={handle}>
              {PLATAFORMAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label className="field-label">DESARROLLADOR</label>
            <input className="field-input" name="desarrollador" value={form.desarrollador}
              onChange={handle} placeholder="ej. FromSoftware" />
          </div>
          <div className="field">
            <label className="field-label">PUNTUACIÓN (0–10)</label>
            <input className="field-input" name="puntuacion" type="number"
              min="0" max="10" step="0.5" value={form.puntuacion}
              onChange={handle} placeholder="Sin puntuar" />
          </div>
          <div className="field">
            <label className="field-label">HORAS JUGADAS</label>
            <input className="field-input" name="horasJugadas" type="number"
              min="0" value={form.horasJugadas} onChange={handle} placeholder="0" />
          </div>
        </div>

        <label className="field-checkbox">
          <input type="checkbox" name="multijugador" checked={form.multijugador} onChange={handle} />
          <span className="checkbox-box" />
          <span>Tiene modo multijugador</span>
        </label>

        <div className="field field-full">
          <label className="field-label">NOTAS PERSONALES</label>
          <textarea className="field-input field-textarea" name="notas"
            value={form.notas} onChange={handle}
            placeholder="Tu opinión, tips, spoilers..." rows={3} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {esEdicion ? '[ GUARDAR CAMBIOS ]' : '[ AGREGAR JUEGO ]'}
          </button>
          <button type="button" className="btn-ghost" onClick={onCancelar}>
            CANCELAR
          </button>
        </div>

      </form>
    </div>
  );
}