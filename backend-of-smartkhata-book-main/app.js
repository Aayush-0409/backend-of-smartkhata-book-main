import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

import notificationRoutes from "./routes/notificationRoutes.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import ledgerRoutes from "./routes/ledgerRoutes.js";
import customerPortalRoutes from "./routes/customerPortalRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();

/* =========================================
   CORS CONFIGURATION
========================================= */




const allowedOrigins = [
  "https://smartkhatabooks.netlify.app",

  // Flutter web development
  "http://localhost:7218",
  "http://127.0.0.1:7218",
  "http://localhost:13801",
  "http://127.0.0.1:13801",
  "http://localhost:9423",
  "http://127.0.0.1:9423",
  "http://localhost:13553",
  "http://127.0.0.1:13553",
  "http://localhost:6213",
  "http://127.0.0.1:6213",

  // Other local development ports
  "http://localhost:3000",
  "http://localhost:4000",
  "http://localhost:5000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4000",
  "http://127.0.0.1:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token"
  );

  if (req.method === "OPTIONS") {
    console.log(`CORS preflight: ${origin || "No origin"}`);
    return res.status(204).end();
  }

  next();
});


/* =========================================
   BODY PARSERS
========================================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================
   REQUEST LOGGER - TEMPORARY DEBUGGING
========================================= */

app.use((req, res, next) => {
  console.log(` ${req.method} ${req.url}`);
  next();
});

/* =========================================
   HEALTH CHECK
========================================= */

app.get("/ping", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Server awake",
  });
});

/* =========================================
   API ROUTES
========================================= */

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRouter);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/customer-portal", customerPortalRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);

/* =========================================
   API TEST ROUTE
========================================= */

app.get("/api", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "API Working",
  });
});

/* =========================================
   404 HANDLER
========================================= */

app.use((req, res) => {
  console.log(` Route not found: ${req.method} ${req.url}`);

  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use((err, req, res, next) => {
  console.error(" Express error:", err.stack || err.message);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* =========================================
   START SERVER
========================================= */

const startServer = async () => {
  try {
    await connection();

    app.listen(port, () => {
      console.log(` Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(" Failed to start application:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;
