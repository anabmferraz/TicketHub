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

router.get("/", authMiddleware, adminMiddleware, listTickets);
router.post("/", authMiddleware, adminMiddleware, createTicket);
router.put("/:id", authMiddleware, adminMiddleware, updateTicket);
router.delete("/:id", authMiddleware, adminMiddleware, deleteTicket);

module.exports = router;
