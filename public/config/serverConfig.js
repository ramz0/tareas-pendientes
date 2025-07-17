const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const path = require('path');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

const app = express();

// ✅ Servir archivos estáticos
app.use('/estilos', express.static(path.join(__dirname, '..', 'estilos')));
app.use('/js', express.static(path.join(__dirname, '..', '..', 'views', 'js'))); // /js/app.js
app.use(express.static(path.join(__dirname, '..', '..', 'views'))); // /index.html y /login.html

// Ruta raíz → redirige a login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'views', 'login.html'));
});

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

module.exports = app;
