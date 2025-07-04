import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import dbConnection from './database/dbConnection.js'
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./routes/userRoutes.js";
import timelineRouter from "./routes/timelineRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import skillRouter from "./routes/skillRoutes.js";
import softwareApplicationRouter from "./routes/softwareApplicationRoutes.js";
import projectRouter from "./routes/projectRoutes.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

// Allowed origins for CORS
const allowedOrigins = [
  "https://codeawakening-dashboard-px5yl0h4g-shiv-468s-projects.vercel.app",
  "https://codeawakening-dashboard.vercel.app",
];

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/timeline", timelineRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/skill", skillRouter);
app.use("/api/v1/softwareapplication", softwareApplicationRouter);
app.use("/api/v1/project", projectRouter);

dbConnection();
app.use(errorMiddleware);

export default app;