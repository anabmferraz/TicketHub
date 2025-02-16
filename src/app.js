require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const { User, Ticket, Purchase } = require("./models");

const app = express();

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views"),
    defaultLayout: "main",
    helpers: {
      multiply: (a, b) => a * b,
      formatDate: (date) => new Date(date).toLocaleDateString("pt-BR"),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchases", purchaseRoutes);

app.get("/login", (req, res) => {
  const error = req.query.error;
  res.render("login", {
    title: "Login",
    error: error || null,
  });
});
app.get("/register", (req, res) =>
  res.render("register", { title: "Cadastro" })
);

app.get("/token-login", (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.redirect("/login?error=Token não fornecido");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.redirect(`/purchases?token=${encodeURIComponent(token)}`);
  } catch (error) {
    res.redirect("/login?error=Token inválido ou expirado");
  }
});
app.get("/purchases", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) throw new Error("Token ausente");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const purchases = await Purchase.findAll({
      where: { userId: decoded.id },
      include: [
        {
          model: Ticket,
          required: true,
          attributes: ["name", "price"],
        },
      ],
      order: [["createdAt", "DESC"]],
      raw: true,
      nest: true,
    });

    res.render("purchaseView", {
      title: "Suas Compras",
      purchases: purchases.length ? purchases : null,
      token,
    });
  } catch (error) {
    console.error("Erro:", error.message);
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});
app.get("/ticket/:id", async (req, res) => {
  const token = req.query.token;

  if (!token) return res.redirect("/login?error=Token ausente");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const purchase = await Purchase.findOne({
      where: {
        id: req.params.id,
        userId: decoded.id,
      },
      include: [Ticket],
    });

    if (!purchase) {
      return res.redirect(
        `/purchases?token=${token}&error=Compra não encontrada`
      );
    }

    res.render("ticketView", {
      title: "Detalhes do Ingresso",
      purchase: purchase.get({ plain: true }),
      token,
    });
  } catch (error) {
    res.redirect("/login?error=Token inválido");
  }
});

User.hasMany(Purchase);
Ticket.hasMany(Purchase);
Purchase.belongsTo(User);
Purchase.belongsTo(Ticket);

const createDefaultAdmin = async () => {
  const adminEmail = "admin@gmail.com";
  const adminPassword = "admin1234";

  try {
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true,
      });
      console.log("Admin criado com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao criar admin:", error);
  }
};

sequelize
  .sync({ force: false })
  .then(async () => {
    await createDefaultAdmin();
    app.listen(3000, () => {
      console.log("Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("Erro ao sincronizar o banco:", error);
  });
