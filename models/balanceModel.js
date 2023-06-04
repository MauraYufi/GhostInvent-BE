const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    balance: {
        type: String,
        required: [true, "Please add a balance"],
        trim: true,  
    },

    }, 
    {
        timestamps: true,
    }
);
module.exports = mongoose.model("Balance", balanceSchema);
