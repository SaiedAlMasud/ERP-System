import { Router } from "express";

import { createSale, getSales, getSaleById, } from "./sale.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getSales)
  .post(createSale);

router
  .route("/:id")
  .get(getSaleById);

export default router;