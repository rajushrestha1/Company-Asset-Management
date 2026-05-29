/**
 * Transaction Model
 * Tracks all asset checkout and return events
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee reference is required'],
    },
    type: {
      type: String,
      enum: ['checkout', 'return'],
      required: [true, 'Transaction type is required'],
    },
    checkout_date: {
      type: Date,
      default: Date.now,
    },
    expected_return_date: {
      type: Date,
      default: null,
    },
    return_date: {
      type: Date,
      default: null,
    },
    condition_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [300, 'Notes cannot exceed 300 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'reserved'],
      default: 'active',
    },
    // Reservation fields
    isReservation: {
      type: Boolean,
      default: false,
    },
    reservedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ employee: 1, status: 1 });
transactionSchema.index({ asset: 1, status: 1 });
transactionSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);