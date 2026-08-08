import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import authService from "./auth.service.js";
import { loginSchema } from "./auth.validation.js";
import User from "../users/user.model.js";

export const login = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.parse(req.body);

  const result = await authService.login(validatedData);

  return res.status(200).json(
    new ApiResponse(
      true,
      "Login successful.",
      result
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