const express = require("express");
const router = express.Router();
const { analyzePdf, analyzeImage } = require("../controller/index");

// Already mounted as /api in app.js
router.post("/analyze-pdf", analyzePdf);
router.post("/analyze-image", analyzeImage);

module.exports = router;
