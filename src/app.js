require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken"); // Importação adicionada
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const { User, Ticket, Purchase } = require("./models");

const app = express();

// Configuração do Handlebars
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./frontend/views");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("frontend/public"));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchases", purchaseRoutes);

// Rotas da Interface Web
app.get("/login", (req, res) => res.render("login"));
app.get("/purchases", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Usando JWT
    const purchases = await Purchase.findAll({
      where: { userId: decoded.id },
      include: [Ticket],
    });
    res.render("purchases", { purchases });
  } catch (error) {
    res.redirect("/login");
  }
});

// Associações dos Modelos (Adicione isso antes de sync())
User.hasMany(Purchase);
Ticket.hasMany(Purchase);
Purchase.belongsTo(User);
Purchase.belongsTo(Ticket);

// Sincronizar Banco de Dados e Iniciar Servidor
sequelize
  .sync({ force: false }) // force: true recria tabelas (use apenas em desenvolvimento!)
  .then(() => {
    app.listen(3000, () => {
      console.log("✅ Servidor rodando em http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error("❌ Erro ao sincronizar o banco:", error);
  });
