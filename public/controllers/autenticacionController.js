const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock de usuarios (en producción usa MongoDB)
const users = [
  { 
    email: "test@test.com", 
    password: bcrypt.hashSync("password123", 10) // Contraseña hasheada
  }
];

const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  // Compara contraseñas hasheadas
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  // Genera token JWT (válido por 1 hora)
  const token = jwt.sign({ email }, process.env.JWT_SECRET || "secreto", { expiresIn: "1h" });
  res.json({ token });
};

module.exports = { login };