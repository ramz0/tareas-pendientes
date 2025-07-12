const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { authenticateToken } = require('../middlewares/autenticacionMiddleware');

// 🔐 Aplica el middleware a TODAS las rutas
router.use(authenticateToken); 

// CRUD Routes (ya protegidas)
router.post('/', tareasController.crearTarea);
router.get('/', tareasController.obtenerTareas);
router.get('/:id', tareasController.obtenerTarea);
router.put('/:id', tareasController.actualizarTarea);
router.delete('/:id', tareasController.eliminarTarea);

module.exports = router;