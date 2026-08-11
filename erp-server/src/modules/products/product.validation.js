import { z } from "zod";

export const createProductSchema = z.object({
  productCode: z
    .string()
    .trim()
    .min(1, "Product code is required.")
    .max(50, "Product code is too long."),

  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(150, "Product name is too long."),

  description: z
    .string()
    .trim()
    .optional()
    .default(""),

  category: z
    .string()
    .trim()
    .optional()
    .default(""),

  brand: z
    .string()
    .trim()
    .optional()
    .default(""),

  unit: z
    .string()
    .trim()
    .min(1, "Unit is required.")
    .default("pcs"),

  purchasePrice: z
    .coerce
    .number()
    .min(0, "Purchase price cannot be negative.")
    .default(0),

  sellingPrice: z
    .coerce
    .number()
    .min(0, "Selling price cannot be negative.")
    .default(0),

  stockQuantity: z
    .coerce
    .number()
    .min(0, "Stock quantity cannot be negative.")
    .default(0),

  reorderLevel: z
    .coerce
    .number()
    .min(0, "Reorder level cannot be negative.")
    .default(0),
});

export const updateProductSchema =
  createProductSchema.partial();