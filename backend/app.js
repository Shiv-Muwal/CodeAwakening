import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dbConnection from './database/dbConnection.js'
import { errorMiddleware } from "./middlewares/error.js";
import { performanceMonitor } from "./middlewares/performance.js";
import userRouter from "./routes/userRoutes.js";
import timelineRouter from "./routes/timelineRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import skillRouter from "./routes/skillRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// Performance monitoring
app.use(performanceMonitor);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// Compression middleware for faster responses
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting for message endpoint
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many message requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: [process.env.PORTFOLIO_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With", 
      "Accept", 
      "Origin",
      "Cache-Control",
      "X-File-Name",
      "timeout"
    ],
    credentials: true,
    optionsSuccessStatus: 200, // For legacy browser support
    preflightContinue: false,
  })
);

// Additional OPTIONS handler for any missed preflight requests
// Express v5 requires named wildcards - changed from app.options('*', cors()) 
app.options('/*catchall', cors());

app.use(cookieParser());

// Optimize JSON parsing with limits
app.use(express.json({ 
  limit: '10mb',
  strict: true 
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  })
);

// Apply rate limiting to message routes
app.use("/api/v1/message", messageLimiter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/project", projectRouter);

dbConnection();
app.use(errorMiddleware);

export default app;