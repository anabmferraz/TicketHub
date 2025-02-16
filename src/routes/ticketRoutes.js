const express = require("express");
const router = express.Router();
const {
  listTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

// Rotas CRUD para tickets (apenas admins)
router.get("/", authMiddleware, adminMiddleware, listTickets); // Listar tickets
router.post("/", authMiddleware, adminMiddleware, createTicket); // Criar ticket
router.put("/:id", authMiddleware, adminMiddleware, updateTicket); // Atualizar ticket
router.delete("/:id", authMiddleware, adminMiddleware, deleteTicket); // Excluir ticket

module.exports = router;
