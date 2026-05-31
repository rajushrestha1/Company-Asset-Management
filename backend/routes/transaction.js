const express = require("express");
const router = express.Router();
const {
  assignAsset,
  reserveAsset,
  cancelReservation,
  returnAsset,
  getMyTransactions,
  getAllTransactions,
  getReservationQueue,
} = require("../controllers/transaction");
const { protect, adminOnly } = require("../middleware/auth");

// Admin routes
router.post("/assign", protect, adminOnly, assignAsset);
router.get("/", protect, adminOnly, getAllTransactions);
router.get("/queue/:assetId", protect, getReservationQueue);

// Employee routes
router.get("/my", protect, getMyTransactions);
router.post("/reserve", protect, reserveAsset);
router.delete("/reserve/:assetId", protect, cancelReservation);
router.put("/return/:transactionId", protect, returnAsset);

module.exports = router;