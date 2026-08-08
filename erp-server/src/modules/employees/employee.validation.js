import { z } from "zod";
import {
  EMPLOYEE_STATUS_VALUES,
  EMPLOYMENT_TYPE_VALUES,
} from "./employee.constants.js";

const optionalDate = z
  .union([
    z.coerce.date(),
    z.literal(""),
    z.null(),
  ])
  .optional();

const addressSchema = z
  .object({
    street: z
      .string()
      .trim()
      .max(150)
      .optional()
      .default(""),

    city: z
      .string()
      .trim()
      .max(50)
      .optional()
      .default(""),

    district: z
      .string()
      .trim()
      .max(50)
      .optional()
      .default(""),

    postalCode: z
      .string()
      .trim()
      .max(20)
      .optional()
      .default(""),
  })
  .optional();

const emergencyContactSchema = z
  .object({
    name: z
      .string()
      .trim()
      .max(100)
      .optional()
      .default(""),

    phone: z
      .string()
      .trim()
      .max(30)
      .optional()
      .default(""),

    relationship: z
      .string()
      .trim()
      .max(50)
      .optional()
      .default(""),
  })
  .optional();

export const createEmployeeSchema = z.object({
  employeeCode: z
    .string()
    .trim()
    .min(2, "Employee code is required.")
    .max(30)
    .toUpperCase(),

  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(50),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required.")
    .max(50),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(5, "Phone number is required.")
    .max(30),

  dateOfBirth: optionalDate,

  gender: z
    .enum(["male", "female", "other"])
    .nullable()
    .optional(),

  address: addressSchema,

  department: z
    .string()
    .trim()
    .nullable()
    .optional(),

  designation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .default(""),

  joiningDate: z.coerce.date({
    message: "Joining date is required.",
  }),

  employmentType: z.enum(
    EMPLOYMENT_TYPE_VALUES,
    {
      message: "Invalid employment type.",
    }
  ),

  status: z
    .enum(EMPLOYEE_STATUS_VALUES, {
      message: "Invalid employee status.",
    })
    .optional(),

  salary: z
    .coerce
    .number()
    .min(0, "Salary cannot be negative.")
    .optional()
    .default(0),

  emergencyContact: emergencyContactSchema,

  notes: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .default(""),
});

export const updateEmployeeSchema =
  createEmployeeSchema.partial();

export const employeeIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "Employee ID is required."),
});

export const employeeQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  search: z
    .string()
    .trim()
    .optional()
    .default(""),

  status: z
    .enum(EMPLOYEE_STATUS_VALUES)
    .optional(),

  employmentType: z
    .enum(EMPLOYMENT_TYPE_VALUES)
    .optional(),

  department: z
    .string()
    .trim()
    .optional(),

  sortBy: z
    .enum([
      "createdAt",
      "joiningDate",
      "firstName",
      "employeeCode",
    ])
    .default("createdAt"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),
});