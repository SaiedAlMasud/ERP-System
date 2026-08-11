"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Warehouse,
  FileText,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const initialForm = {
  productCode: "",
  name: "",
  description: "",
  category: "",
  brand: "",
  unit: "pcs",
  purchasePrice: "",
  sellingPrice: "",
  stockQuantity: "",
  reorderLevel: "",
};

export default function ProductForm() {
  const router = useRouter();

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.productCode.trim()) {
      newErrors.productCode =
        "Product code is required.";
    }

    if (!form.name.trim()) {
      newErrors.name =
        "Product name is required.";
    }

    if (!form.unit.trim()) {
      newErrors.unit =
        "Unit is required.";
    }

    if (
      form.purchasePrice !== "" &&
      (Number.isNaN(
        Number(form.purchasePrice)
      ) ||
        Number(form.purchasePrice) < 0)
    ) {
      newErrors.purchasePrice =
        "Enter a valid purchase price.";
    }

    if (
      form.sellingPrice !== "" &&
      (Number.isNaN(
        Number(form.sellingPrice)
      ) ||
        Number(form.sellingPrice) < 0)
    ) {
      newErrors.sellingPrice =
        "Enter a valid selling price.";
    }

    if (
      form.stockQuantity !== "" &&
      (Number.isNaN(
        Number(form.stockQuantity)
      ) ||
        Number(form.stockQuantity) < 0)
    ) {
      newErrors.stockQuantity =
        "Enter a valid stock quantity.";
    }

    if (
      form.reorderLevel !== "" &&
      (Number.isNaN(
        Number(form.reorderLevel)
      ) ||
        Number(form.reorderLevel) < 0)
    ) {
      newErrors.reorderLevel =
        "Enter a valid reorder level.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        productCode:
          form.productCode.trim(),

        name:
          form.name.trim(),

        description:
          form.description.trim(),

        category:
          form.category.trim(),

        brand:
          form.brand.trim(),

        unit:
          form.unit.trim(),

        purchasePrice:
          form.purchasePrice === ""
            ? 0
            : Number(form.purchasePrice),

        sellingPrice:
          form.sellingPrice === ""
            ? 0
            : Number(form.sellingPrice),

        stockQuantity:
          form.stockQuantity === ""
            ? 0
            : Number(form.stockQuantity),

        reorderLevel:
          form.reorderLevel === ""
            ? 0
            : Number(form.reorderLevel),
      };

      await apiRequest(
        "/products",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      router.push("/products");
      router.refresh();
    } catch (error) {
      setError(
        error.message ||
          "Unable to create product."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex items-center gap-3">
        <Link
          href="/products"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <ArrowLeft size={17} />
        </Link>

        <div>
          <p className="text-sm font-medium text-slate-400">
            Products
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Add Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new product to your catalog.
          </p>
        </div>
      </div>

      {/* Server Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}

        <FormSection
          icon={Package}
          title="Product Information"
          description="Enter the basic information for this product."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Product Code"
              name="productCode"
              value={form.productCode}
              onChange={handleChange}
              error={errors.productCode}
              placeholder="PROD-001"
              required
            />

            <InputField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Paracetamol 500mg"
              required
            />

            <InputField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Medicine"
            />

            <InputField
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="Example Brand"
            />

            <SelectField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              error={errors.unit}
            >
              <option value="pcs">
                Pieces
              </option>

              <option value="box">
                Box
              </option>

              <option value="pack">
                Pack
              </option>

              <option value="kg">
                Kilogram
              </option>

              <option value="gram">
                Gram
              </option>

              <option value="liter">
                Liter
              </option>

              <option value="meter">
                Meter
              </option>
            </SelectField>
          </div>

          <div className="mt-5">
            <label
              htmlFor="description"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add product description..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </FormSection>

        {/* Pricing */}

        <FormSection
          icon={DollarSign}
          title="Pricing"
          description="Set the purchase and selling prices."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              value={form.purchasePrice}
              onChange={handleChange}
              error={errors.purchasePrice}
              placeholder="80"
              min="0"
              step="0.01"
            />

            <InputField
              label="Selling Price"
              name="sellingPrice"
              type="number"
              value={form.sellingPrice}
              onChange={handleChange}
              error={errors.sellingPrice}
              placeholder="100"
              min="0"
              step="0.01"
            />
          </div>
        </FormSection>

        {/* Inventory */}

        <FormSection
          icon={Warehouse}
          title="Initial Inventory"
          description="Set the initial stock and reorder level."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Initial Stock"
              name="stockQuantity"
              type="number"
              value={form.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
              placeholder="50"
              min="0"
              step="1"
            />

            <InputField
              label="Reorder Level"
              name="reorderLevel"
              type="number"
              value={form.reorderLevel}
              onChange={handleChange}
              error={errors.reorderLevel}
              placeholder="10"
              min="0"
              step="1"
            />
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">
              When stock reaches or falls below
              the reorder level, the product can
              later be included in inventory alerts.
            </p>
          </div>
        </FormSection>

        {/* Notes / Information */}

        <FormSection
          icon={FileText}
          title="Product Summary"
          description="Review the information before creating the product."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryItem
              label="Product"
              value={
                form.name || "Not specified"
              }
            />

            <SummaryItem
              label="Code"
              value={
                form.productCode ||
                "Not specified"
              }
            />

            <SummaryItem
              label="Selling Price"
              value={
                form.sellingPrice
                  ? `৳ ${Number(
                      form.sellingPrice
                    ).toLocaleString()}`
                  : "৳ 0"
              }
            />

            <SummaryItem
              label="Initial Stock"
              value={
                form.stockQuantity
                  ? `${form.stockQuantity} ${
                      form.unit || "pcs"
                    }`
                  : `0 ${
                      form.unit || "pcs"
                    }`
              }
            />
          </div>
        </FormSection>

        {/* Actions */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            href="/products"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
}

// ===========================
// Form Section
// ===========================

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={17}
            className="text-slate-600"
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

// ===========================
// Input
// ===========================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  min,
  step,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        step={step}
        className={`h-10 w-full rounded-xl border ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50"
        } px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ===========================
// Select
// ===========================

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium text-slate-600"
      >
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`h-10 w-full rounded-xl border ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50"
        } px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100`}
      >
        {children}
      </select>

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ===========================
// Summary
// ===========================

function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}