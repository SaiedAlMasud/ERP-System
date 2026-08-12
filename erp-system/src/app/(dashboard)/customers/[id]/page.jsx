"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  FileText,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [customer, setCustomer] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest(
            `/customers/${params.id}`
          );

        setCustomer(
          response.data || null
        );
      } catch (error) {
        setError(
          error.message ||
            "Unable to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!customer) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${customer.name}?`
      );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      await apiRequest(
        `/customers/${customer._id}`,
        {
          method: "DELETE",
        }
      );

      router.push("/customers");
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete customer."
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !customer) {
    return (
      <div className="space-y-4">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
          {error || "Customer not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <Link
            href="/customers"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <p className="text-sm font-medium text-slate-400">
              People
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {customer.name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-400">
                {customer.customerCode}
              </span>

              <StatusBadge
                status={customer.status}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/customers/${customer._id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />

            {deleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main Information */}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Contact Information */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={User}
            title="Customer Information"
            description="Basic customer details."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InfoItem
              icon={User}
              label="Name"
              value={customer.name}
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={
                customer.phone ||
                "Not provided"
              }
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={
                customer.email ||
                "Not provided"
              }
            />

            <InfoItem
              icon={CalendarDays}
              label="Created"
              value={formatDate(
                customer.createdAt
              )}
            />

            <InfoItem
              icon={CalendarDays}
              label="Last Updated"
              value={formatDate(
                customer.updatedAt
              )}
            />
          </div>
        </section>

        {/* Address */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={MapPin}
            title="Address"
            description="Customer location information."
          />

          <div className="mt-6 space-y-4">
            <AddressItem
              label="Street"
              value={
                customer.address
                  ?.street
              }
            />

            <AddressItem
              label="City"
              value={
                customer.address
                  ?.city
              }
            />

            <AddressItem
              label="District"
              value={
                customer.address
                  ?.district
              }
            />

            <AddressItem
              label="Postal Code"
              value={
                customer.address
                  ?.postalCode
              }
            />
          </div>
        </section>
      </div>

      {/* Notes */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          icon={FileText}
          title="Notes"
          description="Additional information about this customer."
        />

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {customer.notes ||
              "No notes available."}
          </p>
        </div>
      </section>

      {/* Audit Information */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <SectionHeader
          title="Record Information"
          description="System information about this customer record."
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <AuditItem
            label="Created By"
            value={
              customer.createdBy?.name ||
              customer.createdBy?.email ||
              "System"
            }
          />

          <AuditItem
            label="Updated By"
            value={
              customer.updatedBy?.name ||
              customer.updatedBy?.email ||
              "System"
            }
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
      {Icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
          <Icon
            size={17}
            className="text-slate-600"
          />
        </div>
      )}

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
  icon: Icon,
  label,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        <Icon size={14} />
        {label}
      </div>

      <p className="mt-1.5 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function AddressItem({
  label,
  value,
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function AuditItem({
  label,
  value,
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const isActive =
    status === "active";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        isActive
          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      {isActive
        ? "Active"
        : "Inactive"}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";

  return new Date(
    value
  ).toLocaleDateString(
    "en-BD",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}