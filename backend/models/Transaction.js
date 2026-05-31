const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin

    checkout_date: { type: Date, required: true },
    expected_return_date: { type: Date, required: true },
    return_date: { type: Date, default: null },

    condition_rating: { type: Number, min: 1, max: 5, default: null },

    status: {
      type: String,
      enum: ["active", "returned"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);