const asyncHandler = require("express-async-handler");
const Balance = require("../models/balanceModel");

// Get all Products
const getBalances = asyncHandler(async (req, res) => {
    const balances = await Balance.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(balances);
  });

module.exports = {
    getBalances
};
  
