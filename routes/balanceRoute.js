const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getBalances,
} = require("../controllers/balanceController");

router.get("/", protect, getBalances);

module.exports = router;