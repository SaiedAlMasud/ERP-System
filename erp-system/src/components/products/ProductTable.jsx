"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import ProductStatusBadge from "./ProductStatusBadge";

export default function ProductTable({
  products,
  onDelete,
}) {
  const [openMenu, setOpenMenu] =
    useState(null);

  if (!products?.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-400">
            —
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No products found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Try changing your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Product
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Category
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Price
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Stock
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product._id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                      {product.name
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/products/${product._id}`}
                        className="block truncate text-sm font-semibold text-slate-800 hover:text-slate-950"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {product.productCode}
                      </p>

                      {product.brand && (
                        <p className="mt-1 text-[11px] text-slate-400">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-sm text-slate-600">
                  {product.category || "—"}
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    ৳{" "}
                    {Number(
                      product.sellingPrice || 0
                    ).toLocaleString()}
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Buy: ৳{" "}
                    {Number(
                      product.purchasePrice || 0
                    ).toLocaleString()}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p
                    className={`text-sm font-semibold ${
                      Number(
                        product.stockQuantity || 0
                      ) <=
                      Number(
                        product.reorderLevel || 0
                      )
                        ? "text-red-600"
                        : "text-slate-700"
                    }`}
                  >
                    {product.stockQuantity ?? 0}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      {product.unit || "pcs"}
                    </span>
                  </p>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Reorder:{" "}
                    {product.reorderLevel ?? 0}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <ProductStatusBadge
                    status={product.status}
                  />
                </td>

                <td className="relative px-3 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === product._id
                          ? null
                          : product._id
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenu === product._id && (
                    <div className="absolute right-3 top-12 z-10 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                      <Link
                        href={`/products/${product._id}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View
                      </Link>

                      <Link
                        href={`/products/${product._id}/edit`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          onDelete(product);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}

      <div className="divide-y divide-slate-100 md:hidden">
        {products.map((product) => (
          <div
            key={product._id}
            className="p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                {product.name
                  ?.charAt(0)
                  ?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      {product.productCode}
                    </p>
                  </div>

                  <ProductStatusBadge
                    status={product.status}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400">
                      Price
                    </p>

                    <p className="font-medium text-slate-700">
                      ৳{" "}
                      {Number(
                        product.sellingPrice || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Stock
                    </p>

                    <p className="font-medium text-slate-700">
                      {product.stockQuantity ?? 0}{" "}
                      {product.unit || "pcs"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/products/${product._id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600"
                  >
                    <Eye size={14} />
                    View
                  </Link>

                  <Link
                    href={`/products/${product._id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-medium text-white"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}