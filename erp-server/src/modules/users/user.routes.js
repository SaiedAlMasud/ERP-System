import { Router } from "express";
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  updateUserStatus,
} from "./user.controller.js";

import authMiddleware from "../../shared/middleware/auth.middleware.js";
import roleMiddleware from "../../shared/middleware/role.middleware.js";
import { USER_ROLES } from "./user.constants.js";

const router = Router();

// ===========================
// User Management Routes
// ===========================

router.use(authMiddleware);

// Create user
router.post(
  "/",
  roleMiddleware(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.HR_MANAGER
  ),
  createUser
);

// Get all users
router.get(
  "/",
  roleMiddleware(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.HR_MANAGER
  ),
  getUsers
);

// Get single user
router.get(
  "/:id",
  roleMiddleware(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.HR_MANAGER
  ),
  getUser
);

// Update user
router.patch(
  "/:id",
  roleMiddleware(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.HR_MANAGER
  ),
  updateUser
);

// Update user status
router.patch(
  "/:id/status",
  roleMiddleware(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.HR_MANAGER
  ),
  updateUserStatus
);

export default router;