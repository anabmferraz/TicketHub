const express = require("express");
const router = express.Router();
const {
  register,
  login,
  createAdmin,
  authenticateToken, 
} = require("../controllers/authController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");


router.post("/register", register);
router.post("/login", login);


router.post("/create-admin", authenticateToken, adminMiddleware, createAdmin);

module.exports = router;
