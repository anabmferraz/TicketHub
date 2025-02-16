const express = require("express");
const router = express.Router();
const {
  createPurchase,
  listPurchases,
} = require("../controllers/purchaseController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/", createPurchase);

router.get("/", listPurchases);

module.exports = router;
