import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./modules/health/health.routes.js";
import errorHandler from "./shared/middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

//app.use("/api/health", healthRoutes);

// Routes
app.use("/api/health", healthRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;