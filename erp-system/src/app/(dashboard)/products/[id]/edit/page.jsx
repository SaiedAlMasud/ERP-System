"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Package,
  DollarSign,
  Warehouse,
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
  status: "active",
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [errors, setErrors] =
    useState({});

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest(
            `/products/${productId}`
          );

        const product = response.data;

        setForm({
          productCode:
            product.productCode || "",
          name: product.name || "",
          description:
            product.description || "",
          category:
            product.category || "",
          brand: product.brand || "",
          unit: product.unit || "pcs",
          purchasePrice:
            product.purchasePrice ?? "",
          sellingPrice:
            product.sellingPrice ?? "",
          stockQuantity:
            product.stockQuantity ?? "",
          reorderLevel:
            product.reorderLevel ?? "",
          status:
            product.status || "active",
        });
      } catch (error) {
        setError(
          error.message ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

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

    const numericFields = [
      "purchasePrice",
      "sellingPrice",
      "stockQuantity",
      "reorderLevel",
    ];

    numericFields.forEach((field) => {
      if (
        form[field] !== "" &&
        (Number.isNaN(Number(form[field])) ||
          Number(form[field]) < 0)
      ) {
        newErrors[field] =
          "Enter a valid value.";
      }
    });

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setSaving(true);

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

        status: form.status,
      };

      await apiRequest(
        `/products/${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify(payload),
        }
      );

      router.push(
        `/products/${productId}`
      );

      router.refresh();
    } catch (error) {
      setError(
        error.message ||
          "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !form.name) {
    return (
      <div className="space-y-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex items-start gap-3">
        <Link
          href={`/products/${productId}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <ArrowLeft size={17} />
        </Link>

        <div>
          <p className="text-sm font-medium text-slate-400">
            Products
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Edit Product
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update product information.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Product Information */}

        <FormSection
          icon={Package}
          title="Product Information"
          description="Update the basic information for this product."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Product Code"
              name="productCode"
              value={form.productCode}
              onChange={handleChange}
              error={errors.productCode}
              required
            />

            <InputField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <InputField
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
            />

            <InputField
              label="Brand"
              name="brand"
              value={form.brand}
              onChange={handleChange}
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

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
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
          description="Update purchase and selling prices."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Purchase Price"
              name="purchasePrice"
              type="number"
              value={form.purchasePrice}
              onChange={handleChange}
              error={errors.purchasePrice}
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
              min="0"
              step="0.01"
            />
          </div>
        </FormSection>

        {/* Inventory */}

        <FormSection
          icon={Warehouse}
          title="Inventory"
          description="Update the current stock information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={form.stockQuantity}
              onChange={handleChange}
              error={errors.stockQuantity}
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
              min="0"
              step="1"
            />
          </div>
        </FormSection>

        {/* Actions */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            href={`/products/${productId}`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

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

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
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
        min={min}
        step={step}
        className={`h-10 w-full rounded-xl border ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50"
        } px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

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