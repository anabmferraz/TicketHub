const express = require("express");
const router = express.Router();
const {
  listTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/ticketController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.use(authMiddleware, adminMiddleware);
router.get("/", listTickets);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);

module.exports = router;
