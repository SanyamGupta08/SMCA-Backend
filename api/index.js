const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http"); // ✅ needed for Vercel
const routes = require("../routes"); // update path
const { FRONTEND_URL, NODE_ENV } = require("../config/server-config");

const app = express();

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Express server running...");
});

// Remove app.listen() entirely for Vercel
// app.listen(PORT, ...) → only used for local dev

module.exports = serverless(app);
