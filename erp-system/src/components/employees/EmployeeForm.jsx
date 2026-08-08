"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  User,
  BriefcaseBusiness,
  MapPin,
  Phone,
} from "lucide-react";

import Link from "next/link";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const initialForm = {
  employeeCode: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  street: "",
  city: "",
  district: "",
  postalCode: "",
  designation: "",
  joiningDate: "",
  employmentType: "full_time",
  salary: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelationship: "",
  notes: "",
};

export default function EmployeeForm() {
  const router = useRouter();

  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

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

    if (!form.employeeCode.trim()) {
      newErrors.employeeCode =
        "Employee code is required.";
    }

    if (!form.firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email =
        "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    }

    if (!form.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required.";
    }

    if (form.salary) {
      const salary = Number(form.salary);

      if (Number.isNaN(salary) || salary < 0) {
        newErrors.salary =
          "Enter a valid salary.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const payload = {
        employeeCode:
          form.employeeCode.trim(),

        firstName:
          form.firstName.trim(),

        lastName:
          form.lastName.trim(),

        email:
          form.email.trim().toLowerCase(),

        phone:
          form.phone.trim(),

        dateOfBirth:
          form.dateOfBirth || null,

        gender:
          form.gender || null,

        address: {
          street:
            form.street.trim(),

          city:
            form.city.trim(),

          district:
            form.district.trim(),

          postalCode:
            form.postalCode.trim(),
        },

        designation:
          form.designation.trim(),

        joiningDate:
          form.joiningDate,

        employmentType:
          form.employmentType,

        salary:
          form.salary
            ? Number(form.salary)
            : 0,

        emergencyContact: {
          name:
            form.emergencyName.trim(),

          phone:
            form.emergencyPhone.trim(),

          relationship:
            form.emergencyRelationship.trim(),
        },

        notes:
          form.notes.trim(),
      };

      await apiRequest(
        "/employees",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      router.push("/employees");
      router.refresh();
    } catch (error) {
      setError(
        error.message ||
          "Unable to create employee."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/employees"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
          </Link>

          <div>
            <p className="text-sm font-medium text-slate-400">
              Employees
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Add Employee
            </h1>
          </div>
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

        <FormSection
          icon={User}
          title="Basic Information"
          description="Enter the employee's basic personal information."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Employee Code"
              name="employeeCode"
              value={form.employeeCode}
              onChange={handleChange}
              error={errors.employeeCode}
              placeholder="EMP-0001"
              required
            />

            <InputField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="Rahim"
              required
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Ahmed"
              required
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="rahim@example.com"
              required
            />

            <InputField
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="01700000000"
              required
            />

            <InputField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />

            <SelectField
              label="Gender"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">
                Select gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>
            </SelectField>
          </div>
        </FormSection>

        {/* Employment Information */}

        <FormSection
          icon={BriefcaseBusiness}
          title="Employment Information"
          description="Add the employee's role and employment details."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Designation"
              name="designation"
              value={form.designation}
              onChange={handleChange}
              placeholder="Software Engineer"
            />

            <InputField
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={form.joiningDate}
              onChange={handleChange}
              error={errors.joiningDate}
              required
            />

            <SelectField
              label="Employment Type"
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
            >
              <option value="full_time">
                Full Time
              </option>

              <option value="part_time">
                Part Time
              </option>

              <option value="contract">
                Contract
              </option>

              <option value="intern">
                Intern
              </option>
            </SelectField>

            <InputField
              label="Salary"
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              error={errors.salary}
              placeholder="50000"
              min="0"
            />
          </div>
        </FormSection>

        {/* Address */}

        <FormSection
          icon={MapPin}
          title="Address"
          description="Add the employee's current address."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Street"
              name="street"
              value={form.street}
              onChange={handleChange}
              placeholder="House / Road"
            />

            <InputField
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Dhaka"
            />

            <InputField
              label="District"
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="Gazipur"
            />

            <InputField
              label="Postal Code"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="1700"
            />
          </div>
        </FormSection>

        {/* Emergency Contact */}

        <FormSection
          icon={Phone}
          title="Emergency Contact"
          description="Add an emergency contact for this employee."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Contact Name"
              name="emergencyName"
              value={form.emergencyName}
              onChange={handleChange}
              placeholder="Contact person"
            />

            <InputField
              label="Contact Phone"
              name="emergencyPhone"
              value={form.emergencyPhone}
              onChange={handleChange}
              placeholder="01700000000"
            />

            <InputField
              label="Relationship"
              name="emergencyRelationship"
              value={
                form.emergencyRelationship
              }
              onChange={handleChange}
              placeholder="Brother"
            />
          </div>
        </FormSection>

        {/* Notes */}

        <FormSection
          title="Additional Notes"
          description="Optional notes about this employee."
        >
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Add any additional information..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
          />
        </FormSection>

        {/* Actions */}

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            href="/employees"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={16} />
            Create Employee
          </button>
        </div>
      </form>
    </div>
  );
}

// ===========================
// Form Section
// ===========================

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
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

      {children}
    </section>
  );
}

// ===========================
// Input Field
// ===========================

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  min,
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
        min={min}
        className={`h-10 w-full rounded-xl border ${
          error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50"
        } px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100`}
      />

      {error && (
        <p className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

// ===========================
// Select Field
// ===========================

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