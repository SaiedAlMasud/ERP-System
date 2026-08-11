"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Plus,
  Package,
  PackageCheck,
  PackageX,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ProductTable from "@/components/products/ProductTable";
import ProductFilters from "@/components/products/ProductFilters";

export default function ProductsPage() {
  const [products, setProducts] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [search, setSearch] =
    useState("");

  const [appliedSearch, setAppliedSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchProducts = useCallback(
    async (
      page = 1,
      searchValue = appliedSearch,
      statusValue = status,
      categoryValue = category
    ) => {
      setLoading(true);
      setError("");

      try {
        const params =
          new URLSearchParams({
            page: String(page),
            limit: "10",
          });

        if (searchValue) {
          params.set(
            "search",
            searchValue
          );
        }

        if (statusValue) {
          params.set(
            "status",
            statusValue
          );
        }

        if (categoryValue) {
          params.set(
            "category",
            categoryValue
          );
        }

        const response =
          await apiRequest(
            `/products?${params.toString()}`
          );

        setProducts(
          response.data?.products || []
        );

        setPagination(
          response.data?.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );
      } catch (error) {
        setError(
          error.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      appliedSearch,
      status,
      category,
    ]
  );

  useEffect(() => {
    fetchProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    setAppliedSearch(search);

    fetchProducts(
      1,
      search,
      status,
      category
    );
  };

  const handleStatusChange = (
    value
  ) => {
    setStatus(value);

    fetchProducts(
      1,
      appliedSearch,
      value,
      category
    );
  };

  const handleCategoryChange = (
    value
  ) => {
    setCategory(value);

    fetchProducts(
      1,
      appliedSearch,
      status,
      value
    );
  };

  const handleReset = () => {
    setSearch("");
    setAppliedSearch("");
    setStatus("");
    setCategory("");

    fetchProducts(
      1,
      "",
      "",
      ""
    );
  };

  const handleDelete = async (
    product
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${product.name}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(
        `/products/${product._id}`,
        {
          method: "DELETE",
        }
      );

      await fetchProducts(
        pagination.page,
        appliedSearch,
        status,
        category
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete product."
      );
    }
  };

  const activeCount =
    products.filter(
      (product) =>
        product.status === "active"
    ).length;

  const inactiveCount =
    products.filter(
      (product) =>
        product.status === "inactive"
    ).length;

  if (
    loading &&
    products.length === 0
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-slate-400">
            Catalog
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your products and pricing.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Product
        </Link>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          title="Total Products"
          value={pagination.total}
          icon={Package}
        />

        <Stat
          title="Active Products"
          value={activeCount}
          icon={PackageCheck}
        />

        <Stat
          title="Inactive Products"
          value={inactiveCount}
          icon={PackageX}
        />
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Filters */}

      <ProductFilters
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
        status={status}
        setStatus={handleStatusChange}
        category={category}
        setCategory={
          handleCategoryChange
        }
        onReset={handleReset}
      />

      {/* Table */}

      <ProductTable
        products={products}
        onDelete={handleDelete}
      />

      {/* Pagination */}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-400">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={
                !pagination.hasPreviousPage ||
                loading
              }
              onClick={() =>
                fetchProducts(
                  pagination.page - 1
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={
                !pagination.hasNextPage ||
                loading
              }
              onClick={() =>
                fetchProducts(
                  pagination.page + 1
                )
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  title,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
          <Icon
            size={17}
            className="text-slate-600"
          />
        </div>
      </div>

      <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}