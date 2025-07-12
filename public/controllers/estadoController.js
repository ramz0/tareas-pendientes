const status = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
  res.json({ 
    server: 'Activo', 
    db: dbStatus,
    lastError: lastDbError ? lastDbError.message : null
  });
}

module.exports = {status};