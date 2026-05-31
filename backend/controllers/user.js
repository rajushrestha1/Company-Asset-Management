const User = require("../models/User");
const Transaction = require("../models/Transaction");

// @GET /api/users  — Admin: list all users
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

// @GET /api/users/:id  — Admin: get one user + their active assets
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const activeTransactions = await Transaction.find({
    employee: user._id,
    status: "active",
  }).populate("asset", "item_name category serial_number image");

  res.json({ user, activeTransactions });
};

// @PUT /api/users/:id  — Admin: update user role/department
const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, department, role } = req.body;
  if (name) user.name = name;
  if (department) user.department = department;
  if (role) user.role = role;

  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, department: updated.department });
};

// @DELETE /api/users/:id  — Admin only
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const active = await Transaction.countDocuments({ employee: user._id, status: "active" });
  if (active > 0) {
    return res.status(400).json({ message: "Cannot delete user with active asset assignments" });
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };