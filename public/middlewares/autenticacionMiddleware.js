const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Formato: "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secreto", (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user; // Añade el usuario al request
    next();
  });
};

module.exports = { authenticateToken };