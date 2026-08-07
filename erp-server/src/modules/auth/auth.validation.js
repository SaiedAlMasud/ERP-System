import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password is too long."),
});

export const forgotPasswordSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password is too long."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });