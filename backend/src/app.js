const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes will be mounted in later steps:
// app.use("/api/auth", authRoutes);
// app.use("/api/tickets", ticketRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

module.exports = app;
