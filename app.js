const app = require('./public/config/serverConfig');
const conectarBD = require('./public/config/db');
const { router: statusRoutes, setLastDbError } = require('./public/routes/estadoRoutes');
const tareaRoutes = require('./public/routes/tareasRoutes');
const authRoutes = require('./public/routes/autenticacionRoutes'); // Futura autenticación

// Rutas
app.use('/status', statusRoutes);
app.use('/tareas', tareaRoutes);
app.use('/auth', authRoutes);

// Conexión a DB (manejo de errores)
conectarBD()
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('❌ MongoDB error:', err.message);
    setLastDbError(err); // Guarda el error para /status
  });

module.exports = app;