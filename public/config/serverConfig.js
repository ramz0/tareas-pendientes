const express = require('express');
const cors = require('cors');
const loggerMiddleware = require('../middlewares/loggerMiddleware');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware); // 👈 Reemplaza tu middleware inline

module.exports = app;