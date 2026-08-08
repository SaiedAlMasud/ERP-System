import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import authService from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";
import User from "../users/user.model.js";
import { env } from "../../config/env.js";

export const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await authService.login(validatedData);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(
    new ApiResponse(
      true,
      "Login successful.",
      {
        user: result.user,
      }
    )
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      true,
      "Current user fetched successfully.",
      req.user
    )
  );
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json(
    new ApiResponse(
      true,
      "Logout successful.",
      null
    )
  );
});