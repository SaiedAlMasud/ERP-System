import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import userService from "./user.service.js";
import {
  createUserSchema,
  updateUserSchema,
  updateUserStatusSchema,
} from "./user.validation.js";

// ===========================
// Create User
// ===========================

export const createUser = asyncHandler(async (req, res) => {
  const validatedData = createUserSchema.parse(req.body);

  const user = await userService.create(
    validatedData,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(
      true,
      "User created successfully.",
      user
    )
  );
});

// ===========================
// Get All Users
// ===========================

export const getUsers = asyncHandler(async (req, res) => {
  const filters = {
    role: req.query.role,
    status: req.query.status,
    search: req.query.search,
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
  };

  const result = await userService.getAll(filters);

  return res.status(200).json(
    new ApiResponse(
      true,
      "Users fetched successfully.",
      result
    )
  );
});

// ===========================
// Get User by ID
// ===========================

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);

  return res.status(200).json(
    new ApiResponse(
      true,
      "User fetched successfully.",
      user
    )
  );
});

// ===========================
// Update User
// ===========================

export const updateUser = asyncHandler(async (req, res) => {
  const validatedData = updateUserSchema.parse(req.body);

  const user = await userService.update(
    req.params.id,
    validatedData,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      true,
      "User updated successfully.",
      user
    )
  );
});

// ===========================
// Update User Status
// ===========================

export const updateUserStatus = asyncHandler(async (req, res) => {
  const validatedData = updateUserStatusSchema.parse(req.body);

  const user = await userService.updateStatus(
    req.params.id,
    validatedData.status,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      true,
      "User status updated successfully.",
      user
    )
  );
});