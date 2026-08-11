import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getProducts)
  .post(createProduct);

router
  .route("/:id")
  .get(getProductById)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;