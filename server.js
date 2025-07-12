const app = require('./app');
const port = process.env.PORT || 4545;

const server = app.listen(port, () => {
  console.log(`\nServidor corriendo en http://localhost:${port}\n`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
  server.close(() => process.exit(1));
});