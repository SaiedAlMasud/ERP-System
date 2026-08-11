import mongoose from "mongoose";

import {
  PRODUCT_STATUS_VALUES,
  PRODUCT_STATUS,
} from "./product.constants.js";

const productSchema = new mongoose.Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    unit: {
      type: String,
      trim: true,
      default: "pcs",
    },

    purchasePrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    stockQuantity: {
      type: Number,
      min: 0,
      default: 0,
    },

    reorderLevel: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: PRODUCT_STATUS_VALUES,
      default: PRODUCT_STATUS.ACTIVE,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index(
  { productCode: 1 },
  { unique: true }
);

productSchema.index({ name: 1 });
productSchema.index({ status: 1 });
productSchema.index({ category: 1 });

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;