import { Router } from "express";

import {
  getDashboardOverview,
} from "./dashboard.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
  "/overview",
  getDashboardOverview
);

export default router;