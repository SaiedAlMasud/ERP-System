import { z } from "zod";

import {
  PAYMENT_METHOD_VALUES,
  PAYMENT_STATUS_VALUES,
  SALE_STATUS_VALUES,
} from "./sale.constants.js";

const saleItemSchema = z.object({
  product: z
    .string()
    .min(1, "Product is required."),

  quantity: z
    .number()
    .int()
    .positive("Quantity must be greater than 0."),

  unitPrice: z
    .number()
    .nonnegative("Unit price cannot be negative."),
});

export const createSaleSchema = z.object({
  invoiceNumber: z
    .string()
    .trim()
    .min(1, "Invoice number is required."),

  customer: z
    .string()
    .optional()
    .nullable(),

  items: z
    .array(saleItemSchema)
    .min(1, "At least one product is required."),

  discount: z
    .number()
    .nonnegative()
    .default(0),

  tax: z
    .number()
    .nonnegative()
    .default(0),

  paymentMethod: z
    .enum(PAYMENT_METHOD_VALUES)
    .default("cash"),

  paymentStatus: z
    .enum(PAYMENT_STATUS_VALUES)
    .default("paid"),

  status: z
    .enum(SALE_STATUS_VALUES)
    .default("completed"),

  saleDate: z
    .string()
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
});

export const updateSaleSchema =
  z.object({
    paymentStatus: z
      .enum(PAYMENT_STATUS_VALUES)
      .optional(),

    status: z
      .enum(SALE_STATUS_VALUES)
      .optional(),

    notes: z
      .string()
      .trim()
      .optional(),
  });