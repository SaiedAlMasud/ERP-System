"use client";

import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
} from "lucide-react";
import { useState } from "react";

import EmployeeStatusBadge from "./EmployeeStatusBadge";

export default function EmployeeTable({
  employees,
  onDelete,
}) {
  const [openMenu, setOpenMenu] = useState(null);

  if (!employees?.length) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <span className="text-lg text-slate-400">
              —
            </span>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-800">
            No employees found
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
      {/* Desktop table */}

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Employee
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Department
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Designation
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Employment
              </th>

              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </th>

              <th className="w-12 px-3 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => {
              const fullName =
                `${employee.firstName || ""} ${
                  employee.lastName || ""
                }`.trim();

              const initials =
                `${employee.firstName?.[0] || ""}${
                  employee.lastName?.[0] || ""
                }`.toUpperCase();

              return (
                <tr
                  key={employee._id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <Link
                          href={`/employees/${employee._id}`}
                          className="block truncate text-sm font-semibold text-slate-800 hover:text-slate-950"
                        >
                          {fullName}
                        </Link>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {employee.employeeCode}
                        </p>

                        <div className="mt-1 flex gap-3">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Mail size={11} />
                            {employee.email}
                          </span>

                          <span className="hidden items-center gap-1 text-[11px] text-slate-400 lg:flex">
                            <Phone size={11} />
                            {employee.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {employee.department?.name || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">
                      {employee.designation || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-500">
                      {employee.employmentType
                        ?.replaceAll("_", " ")
                        .replace(/\b\w/g, (char) =>
                          char.toUpperCase()
                        )}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <EmployeeStatusBadge
                      status={employee.status}
                    />
                  </td>

                  <td className="relative px-3 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(
                          openMenu === employee._id
                            ? null
                            : employee._id
                        )
                      }
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {openMenu === employee._id && (
                      <div className="absolute right-3 top-12 z-10 w-40 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                        <Link
                          href={`/employees/${employee._id}`}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        <Link
                          href={`/employees/${employee._id}/edit`}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenu(null);
                            onDelete(employee);
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
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}

      <div className="divide-y divide-slate-100 md:hidden">
        {employees.map((employee) => {
          const fullName =
            `${employee.firstName || ""} ${
              employee.lastName || ""
            }`.trim();

          const initials =
            `${employee.firstName?.[0] || ""}${
              employee.lastName?.[0] || ""
            }`.toUpperCase();

          return (
            <div
              key={employee._id}
              className="p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {fullName}
                    </p>

                    <p className="text-xs text-slate-400">
                      {employee.employeeCode}
                    </p>
                  </div>
                </div>

                <EmployeeStatusBadge
                  status={employee.status}
                />
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-500">
                <p>{employee.email}</p>

                <p>
                  {employee.designation || "No designation"}
                </p>

                <p>
                  {employee.department?.name ||
                    "No department"}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/employees/${employee._id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600"
                >
                  <Eye size={14} />
                  View
                </Link>

                <Link
                  href={`/employees/${employee._id}/edit`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-medium text-white"
                >
                  <Pencil size={14} />
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}