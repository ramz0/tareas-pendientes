const mongoose = require('mongoose');
const nombreDB = 'tareas';

const conectarDB = async () => {
  try {
    console.log(`Conectando a BD(${nombreDB})...`);
    await mongoose.connect(`mongodb://127.0.0.1:27017/${nombreDB}`, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB: conectado a (${nombreDB})`);
  } catch (error) {
    console.error(`❌ Error MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = conectarDB;