/**
 * src/index.js
 * Punto de entrada del servidor Express.
 *
 * Para iniciar:
 *   npm start          → node --experimental-sqlite src/index.js
 *   npm run dev        → node --experimental-sqlite --watch src/index.js
 */

'use strict';

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const itemsRouter = require('../backend/src/routes/items');

// ─── App ──────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS: solo acepta peticiones del frontend (Vite en dev)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

// Parsear JSON en el body de las peticiones
app.use(express.json());

// ─── Rutas ────────────────────────────────────────────────────────────────────

// Health check — útil para verificar que el servidor responde
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Recurso principal
app.use('/api/items', itemsRouter);

// ─── Manejadores de error ─────────────────────────────────────────────────────

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// Error genérico (debe tener 4 parámetros para que Express lo trate como error handler)
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

// ─── Arrancar ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  Servidor corriendo en http://localhost:${PORT}`);
  console.log('    Endpoints disponibles:');
  console.log(`      GET    http://localhost:${PORT}/api/items`);
  console.log(`      POST   http://localhost:${PORT}/api/items`);
  console.log(`      PUT    http://localhost:${PORT}/api/items/:id`);
  console.log(`      DELETE http://localhost:${PORT}/api/items/:id`);
  console.log(`      POST   http://localhost:${PORT}/api/items/:id/registro\n`);
});
