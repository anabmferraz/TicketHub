const express = require("express");
const router = express.Router();
const {
  register,
  login,
  createAdmin,
} = require("../controllers/authController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/register", register);
router.post("/login", login);

// Rota protegida para criar admins (requer token de admin)
router.post("/create-admin", authMiddleware, adminMiddleware, createAdmin);

module.exports = router;
