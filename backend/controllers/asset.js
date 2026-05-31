const Asset = require("../models/Asset");
const { cloudinary } = require("../config/cloudinary");

// @GET /api/assets  — Admin: all assets | Employee: available assets + their assigned ones
const getAssets = async (req, res) => {
  const { search, category, manufacturer, department, status } = req.query;

  const filter = {};
  if (search) filter.item_name = { $regex: search, $options: "i" };
  if (category) filter.category = category;
  if (manufacturer) filter.manufacturer = { $regex: manufacturer, $options: "i" };
  if (department) filter.department = { $regex: department, $options: "i" };
  if (status) filter.status = status;

  const assets = await Asset.find(filter)
    .populate("assignedTo", "name email department")
    .populate("reservationQueue.employee", "name email department")
    .sort({ createdAt: -1 });

  res.json(assets);
};

// @GET /api/assets/:id
const getAssetById = async (req, res) => {
  const asset = await Asset.findById(req.params.id)
    .populate("assignedTo", "name email department")
    .populate("reservationQueue.employee", "name email department");

  if (!asset) return res.status(404).json({ message: "Asset not found" });
  res.json(asset);
};

// @POST /api/assets  — Admin only
const createAsset = async (req, res) => {
  const { item_name, category, serial_number, manufacturer, department } = req.body;

  const assetData = { item_name, category, serial_number, manufacturer, department };

  if (req.file) {
    assetData.image = req.file.path;           // Cloudinary secure URL
    assetData.imagePublicId = req.file.filename; // Cloudinary public_id
  }

  const asset = await Asset.create(assetData);
  res.status(201).json(asset);
};

// @PUT /api/assets/:id  — Admin only
const updateAsset = async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  const { item_name, category, serial_number, manufacturer, department, status } = req.body;

  if (item_name) asset.item_name = item_name;
  if (category) asset.category = category;
  if (serial_number) asset.serial_number = serial_number;
  if (manufacturer) asset.manufacturer = manufacturer;
  if (department) asset.department = department;
  if (status) asset.status = status;

  // Replace image if new one uploaded
  if (req.file) {
    if (asset.imagePublicId) {
      await cloudinary.uploader.destroy(asset.imagePublicId);
    }
    asset.image = req.file.path;
    asset.imagePublicId = req.file.filename;
  }

  const updated = await asset.save();
  res.json(updated);
};

// @DELETE /api/assets/:id  — Admin only
const deleteAsset = async (req, res) => {
  const asset = await Asset.findById(req.params.id);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  if (asset.status === "checked_out") {
    return res.status(400).json({ message: "Cannot delete a checked-out asset" });
  }

  if (asset.imagePublicId) {
    await cloudinary.uploader.destroy(asset.imagePublicId);
  }

  await asset.deleteOne();
  res.json({ message: "Asset deleted successfully" });
};

// @GET /api/assets/stats  — Admin dashboard metrics
const getStats = async (req, res) => {
  const total = await Asset.countDocuments();
  const available = await Asset.countDocuments({ status: "available" });
  const checkedOut = await Asset.countDocuments({ status: "checked_out" });
  const reserved = await Asset.countDocuments({ status: "reserved" });
  const maintenance = await Asset.countDocuments({ status: "maintenance" });

  res.json({ total, available, checkedOut, reserved, maintenance });
};

module.exports = { getAssets, getAssetById, createAsset, updateAsset, deleteAsset, getStats };