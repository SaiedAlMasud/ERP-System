import customerService from "./customer.service.js";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "./customer.validation.js";

export const createCustomer =
  async (req, res) => {
    const validatedData =
      createCustomerSchema.parse(
        req.body
      );

    const customer =
      await customerService.createCustomer(
        validatedData,
        req.user.id
      );

    res.status(201).json({
      success: true,
      message:
        "Customer created successfully.",
      data: customer,
    });
  };

export const getCustomers =
  async (req, res) => {
    const result =
      await customerService.getCustomers(
        req.query
      );

    res.status(200).json({
      success: true,
      message:
        "Customers fetched successfully.",
      data: result,
    });
  };

export const getCustomerById =
  async (req, res) => {
    const customer =
      await customerService.getCustomerById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Customer fetched successfully.",
      data: customer,
    });
  };

export const updateCustomer =
  async (req, res) => {
    const validatedData =
      updateCustomerSchema.parse(
        req.body
      );

    const customer =
      await customerService.updateCustomer(
        req.params.id,
        validatedData,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message:
        "Customer updated successfully.",
      data: customer,
    });
  };

export const deleteCustomer =
  async (req, res) => {
    await customerService.deleteCustomer(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Customer deleted successfully.",
      data: null,
    });
  };