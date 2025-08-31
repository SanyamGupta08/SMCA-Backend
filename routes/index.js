const express = require("express");
const router = express.Router();
const { analyzePdf, analyzeImage } = require("../controller/index");

// Already mounted as /api in app.js
router.post("/v1/analyze-pdf", analyzePdf);
router.post("/v1/analyze-image", analyzeImage);

module.exports = router;
