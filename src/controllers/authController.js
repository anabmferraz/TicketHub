const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false, // Por padrão, usuários normais não são admin
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error("Erro ao registrar:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email já cadastrado!" });
    }

    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
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

    res.json({
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true, // Define explicitamente como admin
    });

    res.status(201).json({
      id: admin.id,
      email: admin.email,
      isAdmin: admin.isAdmin,
    });
  } catch (error) {
    console.error("Erro ao criar admin:", error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Email já cadastrado!" });
    }

    res.status(500).json({ error: "Erro interno no servidor" });
  }
};
