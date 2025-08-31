const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const {PORT} = require("./config/server-config");

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded body

// Routes
app.use("/api", routes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Express server running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
