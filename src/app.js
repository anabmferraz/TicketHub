require("dotenv").config();
const express = require("express");
const { engine } = require("express-handlebars");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const path = require("path"); // Importe o módulo path
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const { User, Ticket, Purchase } = require("./models");

const app = express();

// 🔹 Configuração do Handlebars (Caminhos Absolutos)
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views"), // Caminho absoluto para views
    defaultLayout: "main", // Nome do arquivo sem extensão
    helpers: {
      multiply: (a, b) => a * b,
      formatDate: (date) => new Date(date).toLocaleDateString("pt-BR"),
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Caminho absoluto

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Caminho para arquivos estáticos

// 🔹 Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchases", purchaseRoutes);

// 🔹 Rotas da Interface Web
app.get("/login", (req, res) => res.render("login", { title: "Login" }));

app.get("/purchases", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const purchases = await Purchase.findAll({
      where: { userId: decoded.id },
      include: [Ticket],
    });

    res.render("purchases", {
      title: "Compras",
      purchases,
      user: decoded,
    });
  } catch (error) {
    res.redirect("/login");
  }
});

app.get("/ticket/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const purchase = await Purchase.findOne({
      where: {
        id: req.params.id,
        userId: decoded.id,
      },
      include: [Ticket],
    });

    if (!purchase) return res.redirect("/purchases");

    res.render("ticketView", {
      title: "Detalhes do Ingresso",
      purchase,
      user: decoded,
    });
  } catch (error) {
    res.redirect("/login");
  }
});

// 🔹 Associações dos Modelos
User.hasMany(Purchase);
Ticket.hasMany(Purchase);
Purchase.belongsTo(User);
Purchase.belongsTo(Ticket);

// 🔹 Criação do Admin Padrão
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
      console.log("✅ Admin criado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao criar admin:", error);
  }
};

// 🔹 Inicialização do Servidor
sequelize
  .sync({ force: false })
  .then(async () => {
    await createDefaultAdmin();
    app.listen(3000, () => {
      console.log("✅ Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao sincronizar o banco:", error);
  });
