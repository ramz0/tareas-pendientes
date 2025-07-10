const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const conectarBD = require('./db');
const tareaRoutes = require('./public/routes/tareasRoutes');

const port = 4545;
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const {originalUrl, method} = req;
  console.log(`Metodo: ${method} \t URL: ${originalUrl}`);
  next();
});
app.use('/tareas', tareaRoutes);

let lastDbError = null;

app.get('/status', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  res.json({ 
    server: 'Activo', 
    db: dbStatus,
    lastError: lastDbError ? lastDbError.message : null
  });
});

// Iniciar servidor
const server = app.listen(port, async () => {
  console.log('\nServidor Corriendo ... ');
  console.log(`URL ==> http://localhost:${port}/\n`);
  
  try {
    await conectarBD();
    console.log('✅ MongoDB: conexion exitosa!!!\n');
  } catch (err) {
    console.error(`❌ MongoDB: No disponible: ${err.message}\n`);
  }
});