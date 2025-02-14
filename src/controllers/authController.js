const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models"); // Ajuste para importar do models/index.js

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Erro detalhado:", error); // Log completo

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email já cadastrado!" });
    }

    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((err) => err.message);
      return res.status(400).json({ error: messages.join(", ") });
    }

    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email não cadastrado!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Senha incorreta!" });
    }

    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Login realizado com sucesso!" });
  } catch (error) {
    console.error("Erro detalhado:", error); // Log completo
    res.status(500).json({ error: "Erro durante o login" });
  }
};
