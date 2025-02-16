const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, Purchase, Ticket } = require("../models");

const SECRET_KEY = process.env.JWT_SECRET || "secretkeyjwt";

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });

    res.status(201).json({ message: "Administrador criado com sucesso!" });
  } catch (error) {
    let errorMessage = "Erro interno no servidor";

    if (error.name === "SequelizeUniqueConstraintError") {
      errorMessage = "Email já cadastrado!";
    }

    res.status(500).json({ error: errorMessage });
  }
};
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Preencha todos os campos!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    if (req.headers["content-type"] === "application/json") {
      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    }

    return res.redirect("/login");
  } catch (error) {
    let errorMessage = "Erro interno no servidor";

    if (error.name === "SequelizeUniqueConstraintError") {
      errorMessage = "Email já cadastrado!";
    }

    if (req.headers["content-type"] === "application/json") {
      return res.status(500).json({ error: errorMessage });
    }

    return res
      .status(500)
      .render("register", { title: "Cadastro", error: errorMessage });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.render("login", {
        title: "Login",
        error: "Credenciais inválidas!",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(`/purchases?token=${encodeURIComponent(token)}`);
  } catch (error) {
    res.render("login", {
      title: "Login",
      error: "Erro interno no servidor",
    });
  }
};

exports.authenticateToken = (req, res, next) => {
  const token = req.query.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token não fornecido!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido ou expirado!" });
    }

    req.user = decoded;
    next();
  });
};

exports.getPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await Purchase.findAll({
      where: { userId },
      include: [Ticket],
      required: false,
    });

    if (req.accepts("html")) {
      return res.render("purchases", {
        title: "Histórico de Compras",
        purchases,
      });
    } else {
      return res.json({ purchases });
    }
  } catch (error) {
    if (req.accepts("html")) {
      return res.status(500).render("error", {
        title: "Erro",
        error: "Erro ao buscar histórico de compras",
      });
    }
    return res
      .status(500)
      .json({ error: "Erro ao buscar histórico de compras" });
  }
};

exports.getTicket = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketId = req.params.ticketId;

    const ticket = await Ticket.findOne({
      where: { id: ticketId },
      include: [
        {
          model: Purchase,
          where: { userId },
        },
      ],
    });

    if (!ticket) {
      if (req.accepts("html")) {
        return res.status(404).render("error", {
          title: "Erro",
          error: "Ingresso não encontrado!",
        });
      }
      return res.status(404).json({ error: "Ingresso não encontrado!" });
    }

    if (req.accepts("html")) {
      return res.render("ticket", { title: "Detalhes do Ingresso", ticket });
    } else {
      return res.json({ ticket });
    }
  } catch (error) {
    if (req.accepts("html")) {
      return res
        .status(500)
        .render("error", { title: "Erro", error: "Erro ao buscar ingresso" });
    }
    return res.status(500).json({ error: "Erro ao buscar ingresso" });
  }
};
