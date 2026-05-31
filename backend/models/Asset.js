const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    item_name: { type: String, required: true, trim: true },
    image: { type: String, default: "" },          // Cloudinary URL
    imagePublicId: { type: String, default: "" },  // Cloudinary public_id for deletion
    category: {
      type: String,
      enum: ["Laptop", "Monitor", "Phone", "Tablet", "Keyboard", "Mouse", "Headset", "Other"],
      required: true,
    },
    serial_number: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    department: { type: String, required: true },

    // Availability tracking
    status: {
      type: String,
      enum: ["available", "checked_out", "reserved", "maintenance"],
      default: "available",
    },

    // Who currently holds this asset (admin assigns)
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    takenDate: { type: Date, default: null },
    expectedReturnDate: { type: Date, default: null },

    // Reservation queue — employees waiting for this asset
    reservationQueue: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reservedAt: { type: Date, default: Date.now },
      },
    ],

    lastConditionRating: { type: Number, min: 1, max: 5, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);