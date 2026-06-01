// backend/src/db/seed.js
// Script de semilla: puebla la tabla `items` con juegos reales de ejemplo.
//
// Uso (desde la carpeta backend):
//   node src/db/seed.js          → inserta los juegos (omite los que ya existan por nombre)
//   node src/db/seed.js --reset  → borra TODOS los items antes de insertar
//
// Pensado para tener datos visibles en la UI al usar el modo API.

const crypto = require('crypto');
const db = require('./database');

// Juegos de ejemplo. Distribuidos entre categorías y estados para que
// las gráficas (distribución por categoría, actividad, progreso) se vean.
const JUEGOS = [
  {
    nombre: 'Elden Ring',
    categoriaId: 'rpg',
    estado: 'completado',
    puntuacion: 10,
    notas: 'GOTY 2022. Mundo abierto brutal.',
    atributos: { plataforma: 'PC', desarrollador: 'FromSoftware', horasTotales: 92 },
  },
  {
    nombre: 'Hades',
    categoriaId: 'indie',
    estado: 'completado',
    puntuacion: 9,
    notas: 'Roguelike perfecto, narrativa increíble.',
    atributos: { plataforma: 'Nintendo Switch', desarrollador: 'Supergiant', horasTotales: 48 },
  },
  {
    nombre: 'The Witcher 3',
    categoriaId: 'rpg',
    estado: 'jugando',
    puntuacion: 10,
    notas: 'Voy por Skellige. Las side quests valen oro.',
    atributos: { plataforma: 'PC', desarrollador: 'CD Projekt Red', horasTotales: 67 },
  },
  {
    nombre: 'Hollow Knight',
    categoriaId: 'aventura',
    estado: 'jugando',
    puntuacion: 9,
    notas: 'Metroidvania difícil pero adictivo.',
    atributos: { plataforma: 'PC', desarrollador: 'Team Cherry', horasTotales: 31 },
  },
  {
    nombre: 'Civilization VI',
    categoriaId: 'estrategia',
    estado: 'pendiente',
    puntuacion: null,
    notas: 'Lo tengo en la biblioteca, aún sin empezar.',
    atributos: { plataforma: 'PC', desarrollador: 'Firaxis', horasTotales: 0 },
  },
  {
    nombre: 'Resident Evil 4 Remake',
    categoriaId: 'terror',
    estado: 'completado',
    puntuacion: 9,
    notas: 'Remake espectacular del clásico.',
    atributos: { plataforma: 'PlayStation 5', desarrollador: 'Capcom', horasTotales: 22 },
  },
  {
    nombre: 'God of War Ragnarök',
    categoriaId: 'accion',
    estado: 'completado',
    puntuacion: 10,
    notas: 'Cierre épico de la saga nórdica.',
    atributos: { plataforma: 'PlayStation 5', desarrollador: 'Santa Monica', horasTotales: 40 },
  },
  {
    nombre: 'EA Sports FC 24',
    categoriaId: 'deportes',
    estado: 'abandonado',
    puntuacion: 6,
    notas: 'Lo dejé, muy parecido al anterior.',
    atributos: { plataforma: 'PlayStation 5', desarrollador: 'EA', horasTotales: 15 },
  },
  {
    nombre: 'Baldur\u2019s Gate 3',
    categoriaId: 'rpg',
    estado: 'jugando',
    puntuacion: 10,
    notas: 'Acto 2. Mejor RPG que he jugado en años.',
    atributos: { plataforma: 'PC', desarrollador: 'Larian', horasTotales: 58 },
  },
  {
    nombre: 'Celeste',
    categoriaId: 'indie',
    estado: 'pendiente',
    puntuacion: null,
    notas: 'Recomendado por un amigo, pendiente.',
    atributos: { plataforma: 'Nintendo Switch', desarrollador: 'Maddy Makes Games', horasTotales: 0 },
  },
];

function seed() {
  const reset = process.argv.includes('--reset');

  if (reset) {
    db.prepare('DELETE FROM items').run();
    console.log('🗑️  Tabla items vaciada (--reset).');
  }

  const existe = db.prepare('SELECT 1 FROM items WHERE nombre = ?');
  const insertar = db.prepare(`
    INSERT INTO items
      (id, nombre, categoriaId, estado, puntuacion,
       fechaRegistro, fechaActividad, notas, atributos, activo)
    VALUES
      (@id, @nombre, @categoriaId, @estado, @puntuacion,
       @fechaRegistro, @fechaActividad, @notas, @atributos, @activo)
  `);

  // Inserta todos dentro de una transacción (más rápido y atómico).
  const insertarTodos = db.transaction((juegos) => {
    let agregados = 0;
    let omitidos = 0;

    juegos.forEach((j, i) => {
      if (existe.get(j.nombre)) {
        omitidos++;
        return;
      }

      // Repartimos las fechas en los últimos días para que la gráfica
      // de actividad de los últimos 7 días tenga variación.
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - (i % 7));
      const iso = fecha.toISOString();

      insertar.run({
        id: crypto.randomUUID(),
        nombre: j.nombre,
        categoriaId: j.categoriaId,
        estado: j.estado,
        puntuacion: j.puntuacion,
        fechaRegistro: iso,
        fechaActividad: iso,
        notas: j.notas,
        atributos: JSON.stringify(j.atributos),
        activo: 1,
      });
      agregados++;
    });

    return { agregados, omitidos };
  });

  const { agregados, omitidos } = insertarTodos(JUEGOS);
  const total = db.prepare('SELECT COUNT(*) AS n FROM items WHERE activo = 1').get().n;

  console.log(`✅ Seed completado: ${agregados} agregados, ${omitidos} omitidos (ya existían).`);
  console.log(`📊 Total de juegos activos en la BD: ${total}`);
}

seed();