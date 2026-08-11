import ApiResponse from "../../shared/utils/ApiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

import productService from "./product.service.js";

export const createProduct = asyncHandler(
  async (req, res) => {
    const product =
      await productService.createProduct(
        req.body,
        req.user._id
      );

    return res.status(201).json(
      new ApiResponse(
        true,
        "Product created successfully.",
        product
      )
    );
  }
);

export const getProducts = asyncHandler(
  async (req, res) => {
    const result =
      await productService.getProducts(
        req.query
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Products fetched successfully.",
        result
      )
    );
  }
);

export const getProductById =
  asyncHandler(async (req, res) => {
    const product =
      await productService.getProductById(
        req.params.id
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Product fetched successfully.",
        product
      )
    );
  });

export const updateProduct =
  asyncHandler(async (req, res) => {
    const product =
      await productService.updateProduct(
        req.params.id,
        req.body,
        req.user._id
      );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Product updated successfully.",
        product
      )
    );
  });

export const deleteProduct =
  asyncHandler(async (req, res) => {
    await productService.deleteProduct(
      req.params.id
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        "Product deleted successfully.",
        null
      )
    );
  });