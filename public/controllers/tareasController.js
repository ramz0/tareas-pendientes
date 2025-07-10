const Tarea = require('../models/Tarea');

// -> CREATE - Crear nueva tarea
exports.crearTarea = async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    await tarea.save();
    console.log("✅ Nueva tarea creada!!!");
    res.status(201).json(tarea);
  } catch (error) {
    console.log("❌ Error al intentar crear una nueva tarea!!!");
    res.status(400).json({ error: error.message });
  }
};

// -> READ - Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find();
    console.log("✅ Tareas Mostradas!!!");
    res.json(tareas);
  } catch (error) {
    console.log("❌ Error al Mostrar las Tareas!!!");
    res.status(500).json({ error: error.message });
  }
};

// -> READ - Obtener una tarea por ID
exports.obtenerTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) 
      return res.status(404).json({ error: 'Tarea no encontrada' });
    
    console.log("✅ Tarea Mostrada!!!");
    res.json(tarea);
  } catch (error) {
    console.log("❌ Error al Mostrar la Tarea!!!");
    res.status(500).json({ error: error.message });
  }
};

// -> UPDATE - Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!tarea) 
      return res.status(404).json({ error: 'Tarea no encontrada' });
    
    console.log("✅ Tarea Actualizada!!!");
    res.json(tarea);
  } catch (error) {
    console.log("❌ Error al Actualizar la Tarea!!!");
    res.status(400).json({ error: error.message });
  }
};

// -> DELETE - Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) 
      return res.status(404).json({ error: 'Tarea no encontrada' });
    
    console.log("✅ Tarea Eliminada!!!");
    res.json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.log("❌ Error al Eliminar la Tarea!!!");
    res.status(500).json({ error: error.message });
  }
};