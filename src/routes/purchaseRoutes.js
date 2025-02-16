const express = require("express");
const router = express.Router();
const {
  createPurchase,
  listPurchases,
} = require("../controllers/purchaseController");
const { authMiddleware } = require("../middlewares/authMiddleware"); // Verifique se a importação está correta

// Protege todas as rotas com o middleware de autenticação
router.use(authMiddleware);

// Rota para criar uma nova compra
router.post("/", createPurchase);

// Rota para listar as compras do usuário autenticado
router.get("/", listPurchases);

module.exports = router;
