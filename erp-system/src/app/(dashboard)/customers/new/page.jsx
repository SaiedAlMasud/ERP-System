"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Save,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: {
    street: "",
    city: "",
    district: "",
    postalCode: "",
  },
  notes: "",
};

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] =
    useState(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    if (
      name === "street" ||
      name === "city" ||
      name === "district" ||
      name === "postalCode"
    ) {
      setForm((previous) => ({
        ...previous,
        address: {
          ...previous.address,
          [name]: value,
        },
      }));
    } else {
      setForm((previous) => ({
        ...previous,
        [name]: value,
      }));
    }

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name =
        "Customer name is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email:
          form.email.trim() || "",
        address: {
          street:
            form.address.street.trim(),
          city:
            form.address.city.trim(),
          district:
            form.address.district.trim(),
          postalCode:
            form.address.postalCode.trim(),
        },
        notes: form.notes.trim(),
      };

      const response =
        await apiRequest(
          "/customers",
          {
            method: "POST",
            body: JSON.stringify(
              payload
            ),
          }
        );

      const customerId =
        response.data?._id;

      if (customerId) {
        router.push(
          `/customers/${customerId}`
        );
      } else {
        router.push("/customers");
      }
    } catch (error) {
      setError(
        error.message ||
          "Unable to create customer."
      );
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

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
            Add Customer
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add a new customer to your organization.
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
        {/* Basic Information */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={UserPlus}
            title="Customer Information"
            description="Basic information about the customer."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
              error={errors.name}
            />

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              required
              error={errors.phone}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="customer@example.com"
              error={errors.email}
            />
          </div>
        </section>

        {/* Address */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            title="Address"
            description="Customer address information."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Street"
              name="street"
              value={
                form.address.street
              }
              onChange={handleChange}
              placeholder="Street / Area"
            />

            <InputField
              label="City"
              name="city"
              value={
                form.address.city
              }
              onChange={handleChange}
              placeholder="City"
            />

            <InputField
              label="District"
              name="district"
              value={
                form.address.district
              }
              onChange={handleChange}
              placeholder="District"
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={
                form.address.postalCode
              }
              onChange={handleChange}
              placeholder="Postal code"
            />
          </div>
        </section>

        {/* Notes */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            title="Additional Information"
            description="Optional notes about this customer."
          />

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add notes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </section>

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/customers"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />

            {saving
              ? "Creating..."
              : "Create Customer"}
          </button>
        </div>
      </form>
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

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
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
        className={`h-10 w-full rounded-xl border bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100 ${
          error
            ? "border-red-300 focus:border-red-300"
            : "border-slate-200 focus:border-slate-300"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}