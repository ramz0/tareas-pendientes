const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const status = require('../controllers/estadoController')

let lastDbError = null;

// Ruta de estado
router.get('/status', status.status);

const setLastDbError = (error) => {
  lastDbError = error;
};

module.exports = { router, setLastDbError };