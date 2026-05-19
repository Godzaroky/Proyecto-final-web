/**
 * routes/items.js
 * 5 endpoints del recurso "items" (videojuegos).
 *
 *  GET    /api/items                → lista todos los activos
 *  POST   /api/items                → crea un nuevo juego
 *  PUT    /api/items/:id            → actualiza un juego existente
 *  DELETE /api/items/:id            → archiva (soft-delete, activo = 0)
 *  POST   /api/items/:id/registro   → agrega una sesión de juego
 */

'use strict';

const express    = require('express');
const { randomUUID } = require('crypto');
const db         = require('../db');

const router = express.Router();

// ─── Helper: convierte una fila cruda en objeto JS limpio ────────────────────
function toItem(row) {
  if (!row) return null;
  return {
    ...row,
    atributos: JSON.parse(row.atributos ?? '{}'),
    activo:    Boolean(row.activo),
  };
}

// ─── GET /api/items ───────────────────────────────────────────────────────────
/**
 * Devuelve todos los videojuegos con activo = 1.
 * Respuesta 200: Item[]
 */
router.get('/', (req, res) => {
  try {
    const rows = db
      .prepare('SELECT * FROM items WHERE activo = 1 ORDER BY fechaRegistro DESC')
      .all();
    res.json(rows.map(toItem));
  } catch (err) {
    console.error('[GET /api/items]', err.message);
    res.status(500).json({ error: 'Error al obtener los juegos.' });
  }
});

// ─── POST /api/items ──────────────────────────────────────────────────────────
/**
 * Crea un videojuego nuevo.
 * Body esperado (JSON):
 *   { nombre, categoriaId?, estado?, puntuacion?, notas?, atributos?, fechaRegistro?, activo? }
 * Respuesta 201: Item creado
 */
router.post('/', (req, res) => {
  try {
    const {
      id,
      nombre,
      categoriaId    = 'rpg',
      estado         = 'pendiente',
      puntuacion     = null,
      fechaRegistro,
      fechaActividad,
      notas          = '',
      atributos      = {},
      activo         = true,
    } = req.body ?? {};

    // Validación mínima
    if (!nombre || !String(nombre).trim()) {
      return res.status(400).json({ error: '"nombre" es obligatorio.' });
    }

    const itemId = id || randomUUID();
    const now    = new Date().toISOString();

    db.prepare(`
      INSERT INTO items
        (id, nombre, categoriaId, estado, puntuacion,
         fechaRegistro, fechaActividad, notas, atributos, activo)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      itemId,
      String(nombre).trim(),
      categoriaId,
      estado,
      puntuacion,
      fechaRegistro  || now,
      fechaActividad || now,
      notas,
      JSON.stringify(atributos),
      activo ? 1 : 0,
    );

    const creado = toItem(db.prepare('SELECT * FROM items WHERE id = ?').get(itemId));
    res.status(201).json(creado);
  } catch (err) {
    console.error('[POST /api/items]', err.message);
    res.status(500).json({ error: 'Error al crear el juego.' });
  }
});

// ─── PUT /api/items/:id ───────────────────────────────────────────────────────
/**
 * Actualiza los campos de un juego existente (partial update).
 * Solo se sobreescriben los campos que vienen en el body.
 * Respuesta 200: Item actualizado
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existente = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
    if (!existente) {
      return res.status(404).json({ error: `Juego con id "${id}" no encontrado.` });
    }

    // Merge: si el campo no viene en el body, conservar el valor actual
    const {
      nombre         = existente.nombre,
      categoriaId    = existente.categoriaId,
      estado         = existente.estado,
      puntuacion     = existente.puntuacion,
      notas          = existente.notas,
      atributos,
      activo,
    } = req.body ?? {};

    const atributosStr = atributos !== undefined
      ? JSON.stringify(atributos)
      : existente.atributos;

    const activoInt = activo !== undefined
      ? (activo ? 1 : 0)
      : existente.activo;

    db.prepare(`
      UPDATE items
      SET nombre = ?, categoriaId = ?, estado = ?, puntuacion = ?,
          notas = ?, atributos = ?, activo = ?, fechaActividad = ?
      WHERE id = ?
    `).run(
      nombre, categoriaId, estado, puntuacion,
      notas, atributosStr, activoInt,
      new Date().toISOString(),
      id,
    );

    const actualizado = toItem(db.prepare('SELECT * FROM items WHERE id = ?').get(id));
    res.json(actualizado);
  } catch (err) {
    console.error('[PUT /api/items/:id]', err.message);
    res.status(500).json({ error: 'Error al actualizar el juego.' });
  }
});

// ─── DELETE /api/items/:id ────────────────────────────────────────────────────
/**
 * Archiva un juego (soft-delete): activo = 0.
 * NO elimina el registro de la BD.
 * Respuesta 200: { message, id }
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const existente = db.prepare('SELECT id FROM items WHERE id = ?').get(id);
    if (!existente) {
      return res.status(404).json({ error: `Juego con id "${id}" no encontrado.` });
    }

    db.prepare(`
      UPDATE items SET activo = 0, fechaActividad = ? WHERE id = ?
    `).run(new Date().toISOString(), id);

    res.json({ message: 'Juego archivado correctamente.', id });
  } catch (err) {
    console.error('[DELETE /api/items/:id]', err.message);
    res.status(500).json({ error: 'Error al archivar el juego.' });
  }
});

// ─── POST /api/items/:id/registro ────────────────────────────────────────────
/**
 * Registra una sesión de juego (actividad) asociada a un juego.
 * Body esperado: { valor?, notas?, fecha? }
 *   valor → ej. horas jugadas en esa sesión
 * Respuesta 201: registro creado
 */
router.post('/:id/registro', (req, res) => {
  try {
    const { id: itemId } = req.params;

    const item = db.prepare('SELECT id FROM items WHERE id = ?').get(itemId);
    if (!item) {
      return res.status(404).json({ error: `Juego con id "${itemId}" no encontrado.` });
    }

    const {
      valor = null,
      notas = '',
      fecha,
    } = req.body ?? {};

    const registroId   = randomUUID();
    const fechaSesion  = fecha || new Date().toISOString();

    db.prepare(`
      INSERT INTO registros (id, itemId, fecha, valor, notas)
      VALUES (?, ?, ?, ?, ?)
    `).run(registroId, itemId, fechaSesion, valor, notas);

    // Actualizar la última actividad del juego padre
    db.prepare('UPDATE items SET fechaActividad = ? WHERE id = ?')
      .run(fechaSesion, itemId);

    const registro = db.prepare('SELECT * FROM registros WHERE id = ?').get(registroId);
    res.status(201).json(registro);
  } catch (err) {
    console.error('[POST /api/items/:id/registro]', err.message);
    res.status(500).json({ error: 'Error al crear el registro.' });
  }
});

module.exports = router;
