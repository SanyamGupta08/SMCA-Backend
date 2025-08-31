const express = require("express");
const multer = require("multer");
const {
  analyzePdf,
  analyzeImage,
} = require("./../../controller/index");

const router = express.Router();

// setup multer (temp upload to /uploads folder)
const upload = multer({ dest: "uploads/" });

// v1 routes
router.post("/analyze-pdf", upload.single("file"), analyzePdf);
router.post("/analyze-image", upload.single("file"), analyzeImage);

module.exports = router;
