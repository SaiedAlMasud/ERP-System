import asyncHandler from "../../shared/utils/asyncHandler.js";
import ApiResponse from "../../shared/utils/ApiResponse.js";

import employeeService from "./employee.service.js";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdSchema,
  employeeQuerySchema,
} from "./employee.validation.js";

// ===========================
// Create Employee
// ===========================

export const createEmployee = asyncHandler(
  async (req, res) => {
    const validatedData =
      createEmployeeSchema.parse(req.body);

    const employee =
      await employeeService.createEmployee(
        validatedData,
        req.user._id
      );

    return res.status(201).json(
      new ApiResponse(
        true,
        "Employee created successfully.",
        employee
      )
    );
  }
);

// ===========================
// Get Employees
// ===========================

export const getEmployees = asyncHandler(
  async (req, res) => {
    const query =
      employeeQuerySchema.parse(req.query);

    const result =
      await employeeService.getEmployees(query);

    return res.status(200).json(
      new ApiResponse(
        true,
        "Employees fetched successfully.",
        result
      )
    );
  }
);

// ===========================
// Get Employee By ID
// ===========================

export const getEmployeeById = asyncHandler(
  async (req, res) => {
    const { id } =
      employeeIdSchema.parse(req.params);

    const employee =
      await employeeService.getEmployeeById(id);

    return res.status(200).json(
      new ApiResponse(
        true,
        "Employee fetched successfully.",
        employee
      )
    );
  }
);

// ===========================
// Update Employee
// ===========================

export const updateEmployee = asyncHandler(
  async (req, res) => {
    const { id } =
      employeeIdSchema.parse(req.params);

    const validatedData =
      updateEmployeeSchema.parse(req.body);

    const employee =
      await employeeService.updateEmployee(
        id,
        validatedData,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Employee updated successfully.",
        employee
      )
    );
  }
);

// ===========================
// Delete Employee
// ===========================

export const deleteEmployee = asyncHandler(
  async (req, res) => {
    const { id } =
      employeeIdSchema.parse(req.params);

    await employeeService.deleteEmployee(id);

    return res.status(200).json(
      new ApiResponse(
        true,
        "Employee deleted successfully.",
        null
      )
    );
  }
);