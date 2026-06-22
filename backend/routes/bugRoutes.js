const express = require("express");

const router = express.Router();

const { analyzeBug } = require("../controllers/bugController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Bug Routes Working"
    });
});

router.post("/analyze-bug", analyzeBug);

module.exports = router;