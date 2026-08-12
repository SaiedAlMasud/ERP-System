import { Router } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "./customer.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getCustomers)
  .post(createCustomer);

router
  .route("/:id")
  .get(getCustomerById)
  .patch(updateCustomer)
  .delete(deleteCustomer);

export default router;