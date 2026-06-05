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

app.use(cors({
  origin: "https://company-asset-management.vercel.app",
  credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

module.exports = app;