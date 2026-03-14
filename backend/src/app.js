const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send("API is running...");
});

// Routes placeholders
// app.use("/api/auth", require("./routes/auth.routes"));

module.exports = app;
