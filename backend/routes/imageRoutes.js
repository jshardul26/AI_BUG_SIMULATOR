const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { analyzeImage } = require("../controllers/imageAnalysisController");

router.post(
    "/analyze-image",
    upload.single("image"),
    analyzeImage
);

module.exports = router;