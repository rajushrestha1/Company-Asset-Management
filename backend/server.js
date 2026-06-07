require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/asset");
const transactionRoutes = require("./routes/transaction");
const userRoutes = require("./routes/user");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Asset Management Backend is running 🚀",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;