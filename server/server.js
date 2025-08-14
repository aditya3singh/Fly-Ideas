const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Import routes
const userRouter = require("./routes/user-routes");
const postRouter = require("./routes/blog-routes");
const commentRouter = require("./routes/commentRoutes");

// Database connection
require("./config/db");

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later."
    }
});
app.use("/api/", limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
        ? process.env.FRONTEND_URL 
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API routes
app.use("/api/auth", userRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Fly Thoughts API is running!",
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error("Global error:", error);
    
    // Mongoose validation error
    if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors
        });
    }
    
    // Mongoose duplicate key error
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `${field} already exists`
        });
    }
    
    // JWT errors
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
    
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired"
        });
    }
    
    // Multer errors
    if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File too large"
        });
    }
    
    // Default error
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error"
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Fly Thoughts API server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
});
