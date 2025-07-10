const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');

// CRUD Routes
router.post('/', tareasController.crearTarea);         // Create
router.get('/', tareasController.obtenerTareas);       // Read (all)
router.get('/:id', tareasController.obtenerTarea);     // Read (one)
router.put('/:id', tareasController.actualizarTarea);  // Update
router.delete('/:id', tareasController.eliminarTarea); // Delete

module.exports = router;