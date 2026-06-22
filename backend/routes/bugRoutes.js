const express = require("express");
const router = express.Router();
const { analyzeBug, getBugHistory, getStats } = require("../controllers/bugController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Bug Routes Working"
    });
});

router.post("/analyze-bug", analyzeBug);
router.get("/bug-history", getBugHistory);
router.get("/stats", getStats);

module.exports = router;