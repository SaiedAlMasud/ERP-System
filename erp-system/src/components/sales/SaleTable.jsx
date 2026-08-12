"use client";

import Link from "next/link";
import {
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

import SaleStatusBadge from "./SaleStatusBadge";
import PaymentStatusBadge from "./PaymentStatusBadge";

export default function SaleTable({
  sales,
}) {
  const [openMenu, setOpenMenu] =
    useState(null);

  if (!sales?.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-lg text-slate-400">
            —
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No sales found
          </h3>

          <p className="mt-1 text-xs text-slate-400">
            Sales transactions will appear here.
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
                Invoice
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Items
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Total
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Payment
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Date
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sales.map((sale) => (
              <tr
                key={sale._id}
                className="transition hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <Link
                    href={`/sales/${sale._id}`}
                    className="text-sm font-semibold text-slate-800 hover:text-slate-950"
                  >
                    {sale.invoiceNumber}
                  </Link>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {sale.customer?.name ||
                      "Walk-in customer"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-700">
                    {sale.items?.length || 0}{" "}
                    {sale.items?.length === 1
                      ? "item"
                      : "items"}
                  </p>

                  {sale.items?.[0] && (
                    <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-400">
                      {sale.items[0].productName}
                      {sale.items.length > 1 &&
                        ` + ${
                          sale.items.length - 1
                        } more`}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <p className="text-sm font-bold text-slate-800">
                    ৳
                    {Number(
                      sale.totalAmount || 0
                    ).toLocaleString()}
                  </p>

                  {sale.discount > 0 && (
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Discount: ৳
                      {Number(
                        sale.discount
                      ).toLocaleString()}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <PaymentStatusBadge
                    status={
                      sale.paymentStatus
                    }
                  />

                  <p className="mt-1 text-[11px] capitalize text-slate-400">
                    {sale.paymentMethod?.replace(
                      "_",
                      " "
                    )}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <SaleStatusBadge
                    status={sale.status}
                  />
                </td>

                <td className="px-5 py-4 text-sm text-slate-500">
                  {formatDate(
                    sale.saleDate
                  )}
                </td>

                <td className="relative px-3 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === sale._id
                          ? null
                          : sale._id
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {openMenu === sale._id && (
                    <div className="absolute right-3 top-12 z-10 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                      <Link
                        href={`/sales/${sale._id}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                      >
                        <Eye size={14} />
                        View Sale
                      </Link>
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
        {sales.map((sale) => (
          <div
            key={sale._id}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/sales/${sale._id}`}
                  className="text-sm font-semibold text-slate-800"
                >
                  {sale.invoiceNumber}
                </Link>

                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(
                    sale.saleDate
                  )}
                </p>
              </div>

              <SaleStatusBadge
                status={sale.status}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-400">
                  Total
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800">
                  ৳
                  {Number(
                    sale.totalAmount || 0
                  ).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Payment
                </p>

                <div className="mt-1">
                  <PaymentStatusBadge
                    status={
                      sale.paymentStatus
                    }
                  />
                </div>
              </div>
            </div>

            <Link
              href={`/sales/${sale._id}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600"
            >
              <Eye size={14} />
              View Sale
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString(
    "en-BD",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}