import { z } from "zod";

import {
    CUSTOMER_STATUS_VALUES,
} from "./customer.constants.js";

const addressSchema = z.object({
    street: z.string().trim().optional(),
    city: z.string().trim().optional(),
    district: z.string().trim().optional(),
    postalCode: z.string().trim().optional(),
});

export const createCustomerSchema =
    z.object({
        customerCode: z
            .string()
            .trim()
            .min(1)
            .optional(),

        name: z
            .string()
            .trim()
            .min(1, "Customer name is required.")
            .max(150),

        email: z
            .string()
            .trim()
            .email("Invalid email address.")
            .optional()
            .or(z.literal("")),

        phone: z
            .string()
            .trim()
            .min(1, "Phone number is required."),

        address:
            addressSchema.optional(),

        status: z
            .enum(CUSTOMER_STATUS_VALUES)
            .optional(),

        notes: z
            .string()
            .trim()
            .optional(),
    });

export const updateCustomerSchema =
    z.object({
        customerCode: z
            .string()
            .trim()
            .min(1)
            .optional(),

        name: z
            .string()
            .trim()
            .min(1)
            .max(150)
            .optional(),

        email: z
            .string()
            .trim()
            .email("Invalid email address.")
            .optional()
            .or(z.literal("")),

        phone: z
            .string()
            .trim()
            .min(1)
            .optional(),

        address:
            addressSchema.optional(),

        status: z
            .enum(CUSTOMER_STATUS_VALUES)
            .optional(),

        notes: z
            .string()
            .trim()
            .optional(),
    });