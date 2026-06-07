const Transaction = require("../models/Transaction");
const Asset = require("../models/Asset");
const User = require("../models/User");

// ─────────────────────────────────────────
// ADMIN: Assign asset to an employee
// ─────────────────────────────────────────
const assignAsset = async (req, res) => {
  const { assetId, employeeId, expectedReturnDate } = req.body;

  if (!assetId || !employeeId || !expectedReturnDate) {
    return res.status(400).json({ message: "assetId, employeeId, and expectedReturnDate are required" });
  }

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  if (asset.status === "checked_out") {
    return res.status(400).json({
      message: "Asset is already checked out",
      assignedTo: asset.assignedTo,
      expectedReturnDate: asset.expectedReturnDate,
    });
  }

  const employee = await User.findById(employeeId);
  if (!employee || employee.role !== "employee") {
    return res.status(404).json({ message: "Employee not found" });
  }

  // Enforce 3-asset limit
  const activeCount = await Transaction.countDocuments({
    employee: employeeId,
    status: "active",
  });

  if (activeCount >= 3) {
    return res.status(400).json({
      message: "Employee already holds 3 assets. Return one before assigning more.",
    });
  }

  const checkoutDate = new Date();

  // Create transaction
  const transaction = await Transaction.create({
    asset: assetId,
    employee: employeeId,
    assignedBy: req.user._id,
    checkout_date: checkoutDate,
    expected_return_date: new Date(expectedReturnDate),
  });

  // Update asset
  asset.status = "checked_out";
  asset.assignedTo = employeeId;
  asset.takenDate = checkoutDate;
  asset.expectedReturnDate = new Date(expectedReturnDate);

  // Remove this employee from reservationQueue if they were in it
  asset.reservationQueue = asset.reservationQueue.filter(
    (r) => r.employee.toString() !== employeeId.toString()
  );

  await asset.save();

  res.status(201).json({
    message: "Asset assigned successfully",
    transaction: await transaction.populate([
      { path: "asset", select: "item_name category serial_number" },
      { path: "employee", select: "name email department" },
      { path: "assignedBy", select: "name email" },
    ]),
  });
};

// ─────────────────────────────────────────
// EMPLOYEE: Reserve an asset (join queue)

// ─────────────────────────────────────────
const reserveAsset = async (req, res) => {
  const { assetId } = req.body;
  const employeeId = req.user._id;

  const asset = await Asset.findById(assetId);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  if (asset.status === "available") {
    return res.status(400).json({ message: "Asset is available — ask admin to assign it directly." });
  }

  // Check if already in queue
  const alreadyReserved = asset.reservationQueue.some(
    (r) => r.employee.toString() === employeeId.toString()
  );
  if (alreadyReserved) {
    return res.status(400).json({ message: "You are already in the reservation queue for this asset." });
  }

  // Check if this employee already holds it
  if (asset.assignedTo?.toString() === employeeId.toString()) {
    return res.status(400).json({ message: "You already have this asset checked out." });
  }

  asset.reservationQueue.push({ employee: employeeId });
  await asset.save();

  const position = asset.reservationQueue.length;

  res.json({
    message: `Reserved successfully. You are #${position} in the queue.`,
    expectedReturnDate: asset.expectedReturnDate,
    queuePosition: position,
  });
};

// ─────────────────────────────────────────
// EMPLOYEE: Cancel their reservation
// ─────────────────────────────────────────
const cancelReservation = async (req, res) => {
  const asset = await Asset.findById(req.params.assetId);
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  const before = asset.reservationQueue.length;
  asset.reservationQueue = asset.reservationQueue.filter(
    (r) => r.employee.toString() !== req.user._id.toString()
  );

  if (asset.reservationQueue.length === before) {
    return res.status(400).json({ message: "You are not in the reservation queue for this asset." });
  }

  await asset.save();
  res.json({ message: "Reservation cancelled." });
};

// ─────────────────────────────────────────
// EMPLOYEE: Return an asset with condition rating
// ─────────────────────────────────────────
const returnAsset = async (req, res) => {
  const { condition_rating } = req.body;

  if (!condition_rating || condition_rating < 1 || condition_rating > 5) {
    return res.status(400).json({ message: "condition_rating is required (1–5)" });
  }

  const transaction = await Transaction.findById(req.params.transactionId);
  if (!transaction) return res.status(404).json({ message: "Transaction not found" });

  if (transaction.status === "returned") {
    return res.status(400).json({ message: "Asset already returned" });
  }

  // Only the assigned employee or admin can return
  if (
    req.user.role !== "admin" &&
    transaction.employee.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ message: "Not authorized to return this asset" });
  }

  const returnDate = new Date();

  // Update transaction
  transaction.return_date = returnDate;
  transaction.condition_rating = condition_rating;
  transaction.status = "returned";
  await transaction.save();

  // Update asset
  const asset = await Asset.findById(transaction.asset);
  asset.assignedTo = null;
  asset.takenDate = null;
  asset.expectedReturnDate = null;
  asset.lastConditionRating = condition_rating;

  // If there's a reservation queue, keep status as "reserved", else "available"
  if (asset.reservationQueue.length > 0) {
    asset.status = "reserved";
  } else {
    asset.status = "available";
  }

  await asset.save();

  res.json({
    message: "Asset returned successfully",
    transaction: await transaction.populate([
      { path: "asset", select: "item_name category serial_number status reservationQueue" },
      { path: "employee", select: "name email" },
    ]),
    nextInQueue:
      asset.reservationQueue.length > 0
        ? `Asset is reserved. Next in queue: notify employee ${asset.reservationQueue[0].employee}`
        : "Asset is now available.",
  });
};


const getMyTransactions = async (req, res) => {
  const transactions = await Transaction.find({ employee: req.user._id })
    .populate("asset", "item_name category serial_number manufacturer image")
    .populate("assignedBy", "name email")
    .sort({ createdAt: -1 });

  const active = transactions.filter((t) => t.status === "active");
  const history = transactions.filter((t) => t.status === "returned");

  res.json({ active, history });
};


const getAllTransactions = async (req, res) => {
  const { status, employeeId, assetId } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (employeeId) filter.employee = employeeId;
  if (assetId) filter.asset = assetId;

  const transactions = await Transaction.find(filter)
    .populate("asset", "item_name category serial_number")
    .populate("employee", "name email department")
    .populate("assignedBy", "name email")
    .sort({ createdAt: -1 });

  res.json(transactions);
};


const getReservationQueue = async (req, res) => {
  const asset = await Asset.findById(req.params.assetId).populate(
    "reservationQueue.employee",
    "name email department"
  );
  if (!asset) return res.status(404).json({ message: "Asset not found" });

  res.json({
    asset: asset.item_name,
    status: asset.status,
    currentHolder: asset.assignedTo,
    expectedReturnDate: asset.expectedReturnDate,
    queue: asset.reservationQueue,
  });
};

module.exports = {
  assignAsset,
  reserveAsset,
  cancelReservation,
  returnAsset,
  getMyTransactions,
  getAllTransactions,
  getReservationQueue,
};