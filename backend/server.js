const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const assetRoutes = require("./routes/asset");
const transactionRoutes = require("./routes/transaction");
const userRoutes = require("./routes/user");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://company-asset-management.vercel.app",
];

// Single CORS handler — handles all origins and preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

connectDB()
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Company Asset Management Backend API is running",
    origin: req.headers.origin || null,
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API health check passed",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");

  console.error("Server Error:", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;