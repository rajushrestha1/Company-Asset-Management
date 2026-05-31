const express = require("express");
const router = express.Router();
const {
  getAssets, getAssetById, createAsset, updateAsset, deleteAsset, getStats,
} = require("../controllers/asset");
const { protect, adminOnly } = require("../middleware/auth");
const { upload } = require("../config/cloudinary");

router.get("/stats", protect, adminOnly, getStats);
router.get("/", protect, getAssets);
router.get("/:id", protect, getAssetById);
router.post("/", protect, adminOnly, upload.single("image"), createAsset);
router.put("/:id", protect, adminOnly, upload.single("image"), updateAsset);
router.delete("/:id", protect, adminOnly, deleteAsset);

module.exports = router;