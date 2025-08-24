const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const notesRoutes = require("./routes/notes");
const uploadRoutes = require("./routes/upload");
const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/files");
const chatRoutes = require("./routes/chat");
const userNotesRoutes = require("./routes/userNotes");
const annotationsRoutes = require("./routes/annotations");
const studyMaterialsRoutes = require("./routes/studyMaterials");

const app = express();

// Trust proxy when running behind Azure App Service or load balancer
// This fixes ERR_ERL_UNEXPECTED_X_FORWARDED_FOR error
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// CORS configuration - Updated to handle multiple origins and environment variables
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variable or use defaults
    const envOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : [];
    const allowedOrigins = [
  "http://localhost:3000",
  "https://delightful-water-091bb7200.2.azurestaticapps.net",
  "https://edu-vision-deploy-6gib9rm9c-parth8155s-projects.vercel.app" // <-- Add this
];

    // Allow any origin ending with .azurestaticapps.net
    const isAzureStaticApp = origin && origin.endsWith('.azurestaticapps.net');
    
    if (allowedOrigins.indexOf(origin) !== -1 || isAzureStaticApp) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Rate limiting with custom keyGenerator to handle proxied requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // Custom keyGenerator to avoid X-Forwarded-For parsing errors
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" })); // Add this line for JSON parsing
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint to avoid 404s
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'eduVision Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Handle favicon requests to reduce log noise
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/user-notes", userNotesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/annotations", annotationsRoutes);
app.use("/api/study-materials", studyMaterialsRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  // CORS error
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      origin: req.headers.origin,
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      url: req.url,
      method: req.method,
    }),
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("404 - Route not found:", req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `eduVision Backend Server is running on http://localhost:${port}`
  );
});

module.exports = app;
