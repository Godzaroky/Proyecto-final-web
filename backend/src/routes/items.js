const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Parsear fila de SQLite a objeto JS limpio
function parsearItem(row) {
  if (!row) return null;
  return {
    ...row,
    activo: Boolean(row.activo),
    atributos: (() => {
      try { return JSON.parse(row.atributos || '{}'); }
      catch { return {}; }
    })(),
  };
}

// GET /api/items — todos los activos
router.get('/', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT * FROM items WHERE activo = 1 ORDER BY fechaRegistro DESC')
      .all();
    res.json(rows.map(parsearItem));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/:id — uno solo
router.get('/:id', (req, res) => {
  try {
    const row = db
      .prepare('SELECT * FROM items WHERE id = ?')
      .get(req.params.id);
    if (!row) return res.status(404).json({ error: 'No encontrado' });
    res.json(parsearItem(row));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items — crear
router.post('/', (req, res) => {
  const {
    nombre,
    categoriaId = 'rpg',
    estado = 'pendiente',
    puntuacion = null,
    notas = '',
    atributos = {},
  } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: 'El nombre debe tener al menos 2 caracteres' });
  }

  try {
    const nuevo = {
      id: require('crypto').randomUUID(),
      nombre: nombre.trim(),
      categoriaId,
      estado,
      puntuacion,
      fechaRegistro: new Date().toISOString(),
      fechaActividad: new Date().toISOString(),
      notas,
      atributos: JSON.stringify(atributos),
      activo: 1,
    };

    db.prepare(`
      INSERT INTO items
        (id, nombre, categoriaId, estado, puntuacion,
         fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES
        (@id, @nombre, @categoriaId, @estado, @puntuacion,
         @fechaRegistro, @fechaActividad, @notas, @atributos, @activo)
    `).run(nuevo);

    res.status(201).json(parsearItem({ ...nuevo, activo: 1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/items/:id — actualizar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    categoriaId,
    estado,
    puntuacion,
    notas,
    atributos,
  } = req.body;

  try {
    const actual = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!actual) return res.status(404).json({ error: 'No encontrado' });

    const actualizado = {
      nombre: nombre?.trim() || actual.nombre,
      categoriaId: categoriaId || actual.categoriaId,
      estado: estado || actual.estado,
      puntuacion: puntuacion !== undefined ? puntuacion : actual.puntuacion,
      notas: notas !== undefined ? notas : actual.notas,
      atributos:
        atributos !== undefined
          ? JSON.stringify(atributos)
          : actual.atributos,
      fechaActividad: new Date().toISOString(),
      id,
    };

    db.prepare(`
      UPDATE items SET
        nombre = @nombre, categoriaId = @categoriaId, estado = @estado,
        puntuacion = @puntuacion, notas = @notas, atributos = @atributos,
        fechaActividad = @fechaActividad
      WHERE id = @id
    `).run(actualizado);

    const fila = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    res.json(parsearItem(fila));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/items/:id — archivar (soft delete)
router.delete('/:id', (req, res) => {
  try {
    const info = db
      .prepare('UPDATE items SET activo = 0 WHERE id = ?')
      .run(req.params.id);
    if (info.changes === 0)
      return res.status(404).json({ error: 'No encontrado' });
    res.json({ mensaje: 'Juego archivado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items/:id/registro — registrar horas jugadas ese día
router.post('/:id/registro', (req, res) => {
  const { valor, notas = '' } = req.body;
  if (!valor || isNaN(Number(valor))) {
    return res.status(400).json({ error: 'valor (horas) es requerido y debe ser número' });
  }

  try {
    const juego = db.prepare('SELECT id FROM items WHERE id = ?').get(req.params.id);
    if (!juego) return res.status(404).json({ error: 'Juego no encontrado' });

    const registro = {
      id: require('crypto').randomUUID(),
      itemId: req.params.id,
      fecha: new Date().toISOString().split('T')[0],
      valor: Number(valor),
      notas,
    };

    db.prepare(
      'INSERT INTO registros (id, itemId, fecha, valor, notas) VALUES (@id, @itemId, @fecha, @valor, @notas)'
    ).run(registro);

    // Actualizar fechaActividad del juego
    db.prepare('UPDATE items SET fechaActividad = ? WHERE id = ?').run(
      new Date().toISOString(),
      req.params.id
    );

    res.status(201).json(registro);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
