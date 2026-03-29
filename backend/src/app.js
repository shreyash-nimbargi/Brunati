const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// Connect to database
// connectDB(); // Called in server.js instead

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/users", require("./routes/userRoutes"));
app.use("/api/v1/products", require("./routes/productRoutes"));
app.use("/api/v1/orders", require("./routes/orderRoutes"));
app.use("/api/v1/reviews", require("./routes/reviewRoutes"));
app.use("/api/v1/samples", require("./routes/sampleRoutes"));
app.use("/api/v1/announcements", require("./routes/announcementRoutes"));
app.use("/api/v1/categories", require("./routes/categoryRoutes"));
app.use("/api/v1/banners", require("./routes/bannerRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

app.get('/', (req, res) => {
  res.send("API is running...");
});

// 404 Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
  let message = err.message;
  if (err.name === 'MulterError' || err.message === 'Unexpected field') {
      if (err.field) {
          message = `Unexpected field: '${err.field}'. You uploaded a file using a key name we don't accept. Only 'images' and 'storyImages' are allowed.`;
      } else {
          message = `MulterError: You likely have an empty row in your Postman form-data set to 'File'. Delete any unused rows!`;
      }
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: false,
    message: message,
    data: null,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
