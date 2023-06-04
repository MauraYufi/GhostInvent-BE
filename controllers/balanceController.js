const asyncHandler = require("express-async-handler");
const Balance = require("../models/balanceModel");

// Get all Products
const getBalances = asyncHandler(async (req, res) => {
  const balances = await Balance.findOne({ user: req.user.id });
  res.status(200).json(balances);
});


const updateBalances = asyncHandler(async (req, res) => {
  const { balance } = req.body;

  // Update the balance in MongoDB
  const updatedBalance = await Balance.findOneAndUpdate(
    {  user: "647b493048d50346267c6ac3" },
    { balance },
    { new: true }
  );

  if (!updatedBalance) {
    return res.status(404).json({ error: "Balance not found" });
  }

  res.status(200).json(updatedBalance);
});

module.exports = {
  getBalances,
  updateBalances,
};
