const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http"); // ✅ add this
const routes = require("./routes");
const { PORT, FRONTEND_URL, NODE_ENV } = require("./config/server-config");

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

// Local development
if (NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
}

// Serverless export for Vercel
module.exports = serverless(app); // ✅ wrap app
