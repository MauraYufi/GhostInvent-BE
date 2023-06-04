const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getBalances, updateBalances
} = require("../controllers/balanceController");

router.get("/", protect, getBalances);
router.post("/post", updateBalances);

module.exports = router;