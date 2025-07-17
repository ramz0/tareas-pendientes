const express = require('express');
const router = express.Router();

const {
  enviarNotificacionTelegram
} = require('../controllers/notificacionesController');

router.post('/telegram', enviarNotificacionTelegram);

module.exports = router;
