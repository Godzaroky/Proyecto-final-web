/**
 * db/index.js
 * Inicializa la base de datos SQLite usando el módulo nativo de Node.js 22+.
 * No requiere dependencias externas (no necesita mejor-sqlite3 ni sqlite3 npm).
 *
 * Uso: const db = require('./db');
 *      const fila = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
 */

'use strict';

const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// Ruta del archivo .sqlite — configurable por variable de entorno
const DB_PATH = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.join(__dirname, 'videogames.sqlite');

const db = new DatabaseSync(DB_PATH);

// ─── Pragmas ──────────────────────────────────────────────────────────────────
db.exec('PRAGMA journal_mode = WAL');   // mejor rendimiento de escritura
db.exec('PRAGMA foreign_keys = ON');    // integridad referencial

// ─── Esquema ──────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id             TEXT PRIMARY KEY,
    nombre         TEXT    NOT NULL,
    categoriaId    TEXT    DEFAULT 'rpg',
    estado         TEXT    DEFAULT 'pendiente',
    puntuacion     REAL,
    fechaRegistro  TEXT,
    fechaActividad TEXT,
    notas          TEXT    DEFAULT '',
    atributos      TEXT    DEFAULT '{}',
    activo         INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS registros (
    id      TEXT    PRIMARY KEY,
    itemId  TEXT    NOT NULL,
    fecha   TEXT    NOT NULL,
    valor   REAL,
    notas   TEXT    DEFAULT '',
    FOREIGN KEY (itemId) REFERENCES items(id)
  );
`);

console.log(`[DB] SQLite lista → ${DB_PATH}`);

module.exports = db;
