const express = require("express");
const { analyzePdf, analyzeImage } = require("./../../controller/index");

const router = express.Router();

// v1 routes
router.post("/analyze-pdf", analyzePdf);
router.post("/analyze-image", analyzeImage);

module.exports = router;
