const cron = require('node-cron');
const app = require('./public/config/serverConfig');
const conectarBD = require('./public/config/db');
const verificarTareasPorVencer = require('./public/utils/verificarTareasPorVencer');

const { router: statusRoutes, setLastDbError } = require('./public/routes/estadoRoutes');
const tareaRoutes = require('./public/routes/tareasRoutes');
const authRoutes = require('./public/routes/autenticacionRoutes');
const notificacionesRoutes = require('./public/routes/notificacionesRoutes');


// Rutas
app.use('/status', statusRoutes);
app.use('/tareas', tareaRoutes);
app.use('/notificaciones', notificacionesRoutes);
app.use('/auth', authRoutes);

cron.schedule('0 * * * *', () => {
  console.log('⏳ Ejecutando verificación de tareas por vencer...');
  verificarTareasPorVencer();
});

// Conexión a DB (manejo de errores)
conectarBD()
  .then(() => {
    console.log('✅ MongoDB conectado')
    verificarTareasPorVencer();
  })
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    setLastDbError(err); // Guarda el error para /status
  });
  

module.exports = app;