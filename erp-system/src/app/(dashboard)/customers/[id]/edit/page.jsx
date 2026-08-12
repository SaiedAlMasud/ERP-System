"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  UserPen,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const initialForm = {
  customerCode: "",
  name: "",
  phone: "",
  email: "",
  status: "active",
  address: {
    street: "",
    city: "",
    district: "",
    postalCode: "",
  },
  notes: "",
};

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();

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
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await apiRequest(
            `/customers/${params.id}`
          );

        const customer =
          response.data;

        if (!customer) {
          throw new Error(
            "Customer not found."
          );
        }

        setForm({
          customerCode:
            customer.customerCode || "",
          name:
            customer.name || "",
          phone:
            customer.phone || "",
          email:
            customer.email || "",
          status:
            customer.status || "active",
          address: {
            street:
              customer.address?.street ||
              "",
            city:
              customer.address?.city ||
              "",
            district:
              customer.address?.district ||
              "",
            postalCode:
              customer.address
                ?.postalCode || "",
          },
          notes:
            customer.notes || "",
        });
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

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    const addressFields = [
      "street",
      "city",
      "district",
      "postalCode",
    ];

    if (
      addressFields.includes(name)
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

    if (!form.customerCode.trim()) {
      newErrors.customerCode =
        "Customer code is required.";
    }

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
        customerCode:
          form.customerCode.trim(),

        name:
          form.name.trim(),

        phone:
          form.phone.trim(),

        email:
          form.email.trim(),

        status:
          form.status,

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

        notes:
          form.notes.trim(),
      };

      await apiRequest(
        `/customers/${params.id}`,
        {
          method: "PATCH",
          body: JSON.stringify(
            payload
          ),
        }
      );

      router.push(
        `/customers/${params.id}`
      );
    } catch (error) {
      setError(
        error.message ||
          "Unable to update customer."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

      <div className="flex items-start gap-3">
        <Link
          href={`/customers/${params.id}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <ArrowLeft size={17} />
        </Link>

        <div>
          <p className="text-sm font-medium text-slate-400">
            People
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Edit Customer
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update customer information.
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
        {/* Customer Information */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={UserPen}
            title="Customer Information"
            description="Update the customer's basic information."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Customer Code"
              name="customerCode"
              value={
                form.customerCode
              }
              onChange={
                handleChange
              }
              error={
                errors.customerCode
              }
            />

            <InputField
              label="Customer Name"
              name="name"
              value={form.name}
              onChange={
                handleChange
              }
              required
              error={errors.name}
            />

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={
                handleChange
              }
              required
              error={errors.phone}
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={
                handleChange
              }
              error={errors.email}
            />

            <SelectField
              label="Status"
              name="status"
              value={form.status}
              onChange={
                handleChange
              }
            >
              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </SelectField>
          </div>
        </section>

        {/* Address */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            title="Address"
            description="Update customer address information."
          />

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField
              label="Street"
              name="street"
              value={
                form.address.street
              }
              onChange={
                handleChange
              }
              placeholder="Street / Area"
            />

            <InputField
              label="City"
              name="city"
              value={
                form.address.city
              }
              onChange={
                handleChange
              }
              placeholder="City"
            />

            <InputField
              label="District"
              name="district"
              value={
                form.address.district
              }
              onChange={
                handleChange
              }
              placeholder="District"
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={
                form.address
                  .postalCode
              }
              onChange={
                handleChange
              }
              placeholder="Postal code"
            />
          </div>
        </section>

        {/* Notes */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            title="Additional Information"
            description="Update notes for this customer."
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
              onChange={
                handleChange
              }
              rows={4}
              placeholder="Add notes..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </section>

        {/* Actions */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href={`/customers/${params.id}`}
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
              ? "Saving..."
              : "Save Changes"}
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

function SelectField({
  label,
  name,
  value,
  onChange,
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
        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
      >
        {children}
      </select>
    </div>
  );
}