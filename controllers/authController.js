const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_KEY;

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuario
    const newUser = User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao registrar o usuário" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    // Gera JWT
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };
