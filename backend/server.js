const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bugRoutes = require("./routes/bugRoutes");


const app = express();

// Middleware
app.use(cors());

// Fix: explicit body size limit so it's a deliberate choice rather than
// relying on express's default (100kb), and so it stays in sync with the
// length limits added in validator.js.
app.use(express.json({ limit: "1mb" }));

// Health Check Route
app.get("/", (req, res) => {
    res.send("AI Bug Analyzer Backend Running");
});

// Routes
app.use("/", bugRoutes);

// Fix: no handler existed for unmatched routes — requests to a typo'd or
// removed endpoint fell through to Express's default HTML 404 page instead
// of a clean JSON response.
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Fix: no error-handling middleware existed. Without this, a malformed
// JSON request body (which express.json() throws on) or any uncaught
// synchronous error in a route returns Express's default HTML error page
// instead of a JSON response your frontend can actually parse and display.
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body"
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

// Fix: no fallback if PORT is missing from .env — app.listen(undefined)
// silently binds to a random available port instead of failing loudly or
// using a sane default, which is confusing to debug.
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Guards against a hung downstream call (e.g. a stalled Groq request)
// tying up a connection indefinitely. This is a backstop in addition to,
// not instead of, the per-request timeout added in aiService.js.
server.timeout = 30000;