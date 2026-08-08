import { Router } from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "./employee.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router
  .route("/")
  .get(getEmployees)
  .post(createEmployee);

router
  .route("/:id")
  .get(getEmployeeById)
  .patch(updateEmployee)
  .delete(deleteEmployee);

export default router;