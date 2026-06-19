const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bugRoutes = require("./routes/bugRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/", (req, res) => {
    res.send("AI Bug Analyzer Backend Running");
});

// Routes
app.use("/", bugRoutes);

// Start Server
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});