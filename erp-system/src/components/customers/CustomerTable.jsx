"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
} from "lucide-react";

export default function CustomerTable({
  customers,
  onDelete,
}) {
  if (!customers.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <Phone
            size={20}
            className="text-slate-400"
          />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          No customers found
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Try changing your search or filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Desktop Table */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Customer
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Contact
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Location
              </th>

              <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="transition hover:bg-slate-50/60"
              >
                {/* Customer */}

                <td className="px-5 py-4">
                  <div>
                    <Link
                      href={`/customers/${customer._id}`}
                      className="text-sm font-semibold text-slate-800 transition hover:text-slate-600"
                    >
                      {customer.name}
                    </Link>

                    <p className="mt-0.5 text-xs font-medium uppercase text-slate-400">
                      {customer.customerCode}
                    </p>
                  </div>
                </td>

                {/* Contact */}

                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone
                        size={13}
                        className="text-slate-400"
                      />

                      <span>
                        {customer.phone ||
                          "—"}
                      </span>
                    </div>

                    {customer.email && (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Mail
                          size={13}
                          className="text-slate-400"
                        />

                        <span>
                          {customer.email}
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Location */}

                <td className="px-5 py-4">
                  <p className="text-sm text-slate-600">
                    {formatLocation(
                      customer.address
                    )}
                  </p>
                </td>

                {/* Status */}

                <td className="px-5 py-4 text-center">
                  <StatusBadge
                    status={
                      customer.status
                    }
                  />
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/customers/${customer._id}`}
                      title="View customer"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Eye size={16} />
                    </Link>

                    <Link
                      href={`/customers/${customer._id}/edit`}
                      title="Edit customer"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Pencil
                        size={16}
                      />
                    </Link>

                    <button
                      type="button"
                      title="Delete customer"
                      onClick={() =>
                        onDelete(customer)
                      }
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}

      <div className="divide-y divide-slate-100 md:hidden">
        {customers.map((customer) => (
          <div
            key={customer._id}
            className="p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/customers/${customer._id}`}
                  className="truncate text-sm font-semibold text-slate-800"
                >
                  {customer.name}
                </Link>

                <p className="mt-0.5 text-xs font-medium uppercase text-slate-400">
                  {customer.customerCode}
                </p>
              </div>

              <StatusBadge
                status={customer.status}
              />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone
                  size={14}
                  className="text-slate-400"
                />

                <span>
                  {customer.phone ||
                    "—"}
                </span>
              </div>

              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail
                    size={14}
                    className="text-slate-400"
                  />

                  <span className="truncate">
                    {customer.email}
                  </span>
                </div>
              )}

              <p className="text-sm text-slate-500">
                {formatLocation(
                  customer.address
                )}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <Link
                href={`/customers/${customer._id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Eye size={14} />
                View
              </Link>

              <Link
                href={`/customers/${customer._id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Pencil size={14} />
                Edit
              </Link>

              <button
                type="button"
                onClick={() =>
                  onDelete(customer)
                }
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    active:
      "bg-emerald-50 text-emerald-600 border-emerald-100",

    inactive:
      "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-500 border-slate-200"
      }`}
    >
      {formatLabel(status)}
    </span>
  );
}

function formatLabel(value) {
  if (!value) return "Unknown";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatLocation(address) {
  if (!address) return "—";

  const parts = [
    address.city,
    address.district,
  ].filter(Boolean);

  return parts.length
    ? parts.join(", ")
    : "—";
}