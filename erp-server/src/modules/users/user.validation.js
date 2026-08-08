import { z } from "zod";
import { USER_ROLES, USER_STATUS } from "./user.constants.js";

export const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must not exceed 50 characters."),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name must not exceed 50 characters."),

  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),

  role: z.enum(Object.values(USER_ROLES)),

  status: z
    .enum(Object.values(USER_STATUS))
    .default(USER_STATUS.ACTIVE),

  employeeId: z
    .string()
    .trim()
    .optional()
    .nullable(),

  avatar: z
    .string()
    .trim()
    .optional()
    .nullable(),

  isEmailVerified: z
    .boolean()
    .optional()
    .default(false),
});

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters.")
    .max(50, "First name must not exceed 50 characters.")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters.")
    .max(50, "Last name must not exceed 50 characters.")
    .optional(),

  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase()
    .optional(),

  role: z
    .enum(Object.values(USER_ROLES))
    .optional(),

  status: z
    .enum(Object.values(USER_STATUS))
    .optional(),

  employeeId: z
    .string()
    .trim()
    .optional()
    .nullable(),

  avatar: z
    .string()
    .trim()
    .optional()
    .nullable(),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(Object.values(USER_STATUS)),
});