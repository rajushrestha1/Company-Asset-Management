/**
 * Asset Model
 * Defines the schema for company assets/hardware
 */

const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters'],
      maxlength: [200, 'Item name cannot exceed 200 characters'],
    },
    image: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' }, // Cloudinary public ID for deletion
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Laptop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Phone', 'Tablet', 'Printer', 'Camera', 'Other'],
    },
    serial_number: {
      type: String,
      required: [true, 'Serial number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true, // Allow null but ensure uniqueness when set
      trim: true,
    },
    manufacturer: {
      type: String,
      required: [true, 'Manufacturer is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: ['Engineering', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'IT', 'Legal', 'Other'],
    },
    status: {
      type: String,
      enum: ['available', 'checked_out', 'maintenance', 'retired'],
      default: 'available',
    },
    condition_rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    purchase_date: {
      type: Date,
      default: null,
    },
    purchase_price: {
      type: Number,
      min: 0,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
    currentHolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster searching
assetSchema.index({ item_name: 'text', manufacturer: 'text', serial_number: 'text' });
assetSchema.index({ category: 1, department: 1, status: 1 });
assetSchema.index({ barcode: 1 });

module.exports = mongoose.model('Asset', assetSchema);