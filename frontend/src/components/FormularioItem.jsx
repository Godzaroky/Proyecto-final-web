// src/components/FormularioItem.jsx
import { useState, useRef, useEffect } from 'react';
import { CATEGORIAS } from '../utils/categorias';

const PLATAFORMAS = ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Nintendo Switch', 'Móvil', 'Otra'];

export default function FormularioItem({ onAgregar }) {
  const [form, setForm] = useState({
    nombre:      '',
    categoriaId: 'rpg',
    estado:      'pendiente',
    puntuacion:  '',
    notas:       '',
    plataforma:  'PC',
    desarrollador: '',
  });
  const inputRef = useRef(null);

  // Enfocar el input al montar (useRef — uso 1, heredado de Fase 2)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function cambiar(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function enviar(e) {
    e.preventDefault();
    if (form.nombre.trim().length < 3) return;

    const nuevoJuego = {
      id:             crypto.randomUUID(),
      nombre:         form.nombre.trim(),
      categoriaId:    form.categoriaId,
      estado:         form.estado,
      puntuacion:     form.puntuacion ? Number(form.puntuacion) : null,
      fechaRegistro:  new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas:          form.notas.trim(),
      atributos: {
        plataforma:    form.plataforma,
        desarrollador: form.desarrollador.trim(),
        horasTotales:  0,
      },
      activo: true,
    };

    onAgregar(nuevoJuego);
    setForm({ nombre: '', categoriaId: 'rpg', estado: 'pendiente', puntuacion: '', notas: '', plataforma: 'PC', desarrollador: '' });
    inputRef.current?.focus();
  }

  return (
    <form className="formulario-item" onSubmit={enviar}>
      <h2 className="formulario-titulo">➕ Agregar Juego</h2>

      <div className="form-fila">
        <input
          ref={inputRef}
          className="form-input"
          type="text"
          name="nombre"
          placeholder="Nombre del juego *"
          value={form.nombre}
          onChange={cambiar}
          required
          minLength={3}
        />
        <select className="form-select" name="categoriaId" value={form.categoriaId} onChange={cambiar}>
          {CATEGORIAS.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.emoji} {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-fila">
        <select className="form-select" name="estado" value={form.estado} onChange={cambiar}>
          <option value="pendiente">📋 Pendiente</option>
          <option value="jugando">🎮 Jugando</option>
          <option value="completado">✅ Completado</option>
          <option value="abandonado">❌ Abandonado</option>
        </select>
        <select className="form-select" name="plataforma" value={form.plataforma} onChange={cambiar}>
          {PLATAFORMAS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="form-fila">
        <input
          className="form-input"
          type="number"
          name="puntuacion"
          placeholder="Puntuación (0–10)"
          min="0"
          max="10"
          step="0.5"
          value={form.puntuacion}
          onChange={cambiar}
        />
        <input
          className="form-input"
          type="text"
          name="desarrollador"
          placeholder="Desarrollador (opcional)"
          value={form.desarrollador}
          onChange={cambiar}
        />
      </div>

      <textarea
        className="form-textarea"
        name="notas"
        placeholder="Notas personales..."
        rows={2}
        value={form.notas}
        onChange={cambiar}
      />

      <button className="btn-agregar" type="submit" disabled={form.nombre.trim().length < 3}>
        🎮 Agregar al Backlog
      </button>
    </form>
  );
}
