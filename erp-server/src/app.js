import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import healthRoutes from "./modules/health/health.routes.js";
import errorHandler from "./shared/middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import { env } from "./config/env.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import employeeRoutes from "./modules/employees/employee.routes.js";
import productRoutes from "./modules/products/product.routes.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/products", productRoutes);

// Global Error Handler (must be last)
app.use(errorHandler);

export default app;