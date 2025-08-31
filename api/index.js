const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http"); // ✅ needed for Vercel
const routes = require("../routes/index"); // update path
const { PORT,FRONTEND_URL } = require("../config/server-config");

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

app.listen(PORT, (req, res) => {
    console.log(`sever started at port ${PORT}`)
});

