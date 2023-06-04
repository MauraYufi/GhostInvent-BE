const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
