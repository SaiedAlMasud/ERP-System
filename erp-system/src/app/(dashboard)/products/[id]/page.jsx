"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  DollarSign,
  Warehouse,
  CalendarDays,
  Tag,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProductStatusBadge from "@/components/products/ProductStatusBadge";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productId = params?.id;

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest(
          `/products/${productId}`
        );

        setProduct(response.data);
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

  const handleDelete = async () => {
    if (!product) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await apiRequest(
        `/products/${product._id}`,
        {
          method: "DELETE",
        }
      );

      router.push("/products");
      router.refresh();
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete product."
      );
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !product) {
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

  if (!product) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Product not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <Link
            href="/products"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Products
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {product.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Product code: {product.productCode}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${product._id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Overview */}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Product Information */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Package}
            title="Product Information"
            description="Basic information about this product."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Product Name"
              value={product.name}
            />

            <InfoItem
              label="Product Code"
              value={product.productCode}
            />

            <InfoItem
              label="Category"
              value={product.category || "—"}
              icon={Tag}
            />

            <InfoItem
              label="Brand"
              value={product.brand || "—"}
            />

            <InfoItem
              label="Unit"
              value={product.unit || "pcs"}
            />

            <div>
              <p className="text-xs font-medium text-slate-400">
                Status
              </p>

              <div className="mt-2">
                <ProductStatusBadge
                  status={product.status}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-xs font-medium text-slate-400">
              Description
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {product.description ||
                "No description provided."}
            </p>
          </div>
        </section>

        {/* Quick Summary */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={DollarSign}
            title="Pricing"
            description="Current product pricing."
          />

          <div className="mt-6 space-y-4">
            <PriceItem
              label="Selling Price"
              value={product.sellingPrice}
            />

            <PriceItem
              label="Purchase Price"
              value={product.purchasePrice}
            />

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                Estimated margin
              </p>

              <p className="mt-1 text-lg font-bold text-slate-900">
                ৳
                {(
                  Number(
                    product.sellingPrice || 0
                  ) -
                  Number(
                    product.purchasePrice || 0
                  )
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Inventory */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={Warehouse}
          title="Inventory Information"
          description="Current stock information."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Current Stock"
            value={`${product.stockQuantity ?? 0} ${
              product.unit || "pcs"
            }`}
          />

          <MetricCard
            label="Reorder Level"
            value={`${product.reorderLevel ?? 0} ${
              product.unit || "pcs"
            }`}
          />

          <MetricCard
            label="Stock Status"
            value={
              Number(
                product.stockQuantity || 0
              ) <=
              Number(
                product.reorderLevel || 0
              )
                ? "Low Stock"
                : "In Stock"
            }
            danger={
              Number(
                product.stockQuantity || 0
              ) <=
              Number(
                product.reorderLevel || 0
              )
            }
          />
        </div>
      </section>

      {/* Metadata */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={CalendarDays}
          title="Record Information"
          description="Product record metadata."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <InfoItem
            label="Created"
            value={formatDate(product.createdAt)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(product.updatedAt)}
          />
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-3">
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
  );
}

function InfoItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function PriceItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        ৳{Number(value || 0).toLocaleString()}
      </p>
    </div>
  );
}

function MetricCard({
  label,
  value,
  danger = false,
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        danger
          ? "border-red-200 bg-red-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-lg font-bold ${
          danger
            ? "text-red-600"
            : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-BD",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}