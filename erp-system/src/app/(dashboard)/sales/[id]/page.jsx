"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  CalendarDays,
  CreditCard,
  User,
  Package,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import SaleStatusBadge from "@/components/sales/SaleStatusBadge";
import PaymentStatusBadge from "@/components/sales/PaymentStatusBadge";

export default function SaleDetailsPage() {
  const params = useParams();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const saleId = params?.id;

  useEffect(() => {
    if (!saleId) return;

    const fetchSale = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest(
          `/sales/${saleId}`
        );

        setSale(response.data);
      } catch (error) {
        setError(
          error.message ||
            "Unable to load sale."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/sales"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Sales
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Sale not found.
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
            href="/sales"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Sales
            </p>

            <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <Receipt size={22} />
              {sale.invoiceNumber}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Sale transaction details.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SaleStatusBadge
            status={sale.status}
          />

          <PaymentStatusBadge
            status={sale.paymentStatus}
          />
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Sale Date"
          value={formatDate(
            sale.saleDate
          )}
        />

        <SummaryCard
          icon={CreditCard}
          label="Payment Method"
          value={formatPaymentMethod(
            sale.paymentMethod
          )}
        />

        <SummaryCard
          icon={User}
          label="Customer"
          value={
            sale.customer?.name ||
            "Walk-in Customer"
          }
        />

        <SummaryCard
          icon={Package}
          label="Items"
          value={`${sale.items?.length || 0} ${
            sale.items?.length === 1
              ? "item"
              : "items"
          }`}
        />
      </div>

      {/* Items */}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              <Package
                size={17}
                className="text-slate-600"
              />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Sale Items
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Products included in this transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Product
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Quantity
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Subtotal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {sale.items?.map((item, index) => (
                <tr
                  key={`${item.product}-${index}`}
                  className="hover:bg-slate-50/60"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {item.productName}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.productCode}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-right text-sm text-slate-600">
                    ৳
                    {Number(
                      item.unitPrice || 0
                    ).toLocaleString()}
                  </td>

                  <td className="px-6 py-4 text-center text-sm text-slate-600">
                    {item.quantity}{" "}
                    {item.unit || ""}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                    ৳
                    {Number(
                      item.subtotal || 0
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}

        <div className="divide-y divide-slate-100 md:hidden">
          {sale.items?.map((item, index) => (
            <div
              key={`${item.product}-${index}`}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {item.productName}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.productCode}
                  </p>
                </div>

                <p className="text-sm font-semibold text-slate-800">
                  ৳
                  {Number(
                    item.subtotal || 0
                  ).toLocaleString()}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-400">
                    Unit Price
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    ৳
                    {Number(
                      item.unitPrice || 0
                    ).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Information */}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Notes */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Transaction Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Invoice Number"
              value={sale.invoiceNumber}
            />

            <InfoItem
              label="Payment Method"
              value={formatPaymentMethod(
                sale.paymentMethod
              )}
            />

            <InfoItem
              label="Payment Status"
              value={formatLabel(
                sale.paymentStatus
              )}
            />

            <InfoItem
              label="Sale Status"
              value={formatLabel(
                sale.status
              )}
            />

            <InfoItem
              label="Created By"
              value={
                sale.createdBy?.name ||
                sale.createdBy?.email ||
                "—"
              }
            />

            <InfoItem
              label="Created At"
              value={formatDate(
                sale.createdAt
              )}
            />
          </div>

          {sale.notes && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-xs font-medium text-slate-400">
                Notes
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {sale.notes}
              </p>
            </div>
          )}
        </section>

        {/* Amount Summary */}

        <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">
            Amount Summary
          </h2>

          <div className="mt-5 space-y-4">
            <AmountRow
              label="Subtotal"
              value={sale.subtotal}
            />

            <AmountRow
              label="Discount"
              value={sale.discount}
            />

            <AmountRow
              label="Tax"
              value={sale.tax}
            />

            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-800">
                  Total
                </span>

                <span className="text-xl font-bold text-slate-900">
                  ৳
                  {Number(
                    sale.totalAmount || 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={17}
            className="text-slate-600"
          />
        </div>

        <div className="min-w-0">
          <p className="text-xs text-slate-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold capitalize text-slate-800">
            {value}
          </p>
        </div>
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

function AmountRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-medium text-slate-700">
        ৳
        {Number(value || 0).toLocaleString()}
      </span>
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

function formatLabel(value) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatPaymentMethod(value) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}