"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Plus,
    Users,
    UserCheck,
    UserX,
    CalendarDays,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeFilters from "@/components/employees/EmployeeFilters";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // Input value
    const [search, setSearch] = useState("");

    // Currently applied search
    const [appliedSearch, setAppliedSearch] =
        useState("");

    const [status, setStatus] = useState("");
    const [employmentType, setEmploymentType] =
        useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ===========================
    // Fetch Employees
    // ===========================

    const fetchEmployees = useCallback(
        async (
            page = 1,
            searchValue = appliedSearch,
            statusValue = status,
            employmentTypeValue = employmentType
        ) => {
            setLoading(true);
            setError("");

            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: "10",
                });

                if (searchValue) {
                    params.set("search", searchValue);
                }

                if (statusValue) {
                    params.set("status", statusValue);
                }

                if (employmentTypeValue) {
                    params.set(
                        "employmentType",
                        employmentTypeValue
                    );
                }

                const response = await apiRequest(
                    `/employees?${params.toString()}`
                );

                setEmployees(
                    response.data?.employees || []
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
                    "Unable to load employees."
                );
            } finally {
                setLoading(false);
            }
        },
        [appliedSearch, status, employmentType]
    );

    // ===========================
    // Initial Load
    // ===========================

    useEffect(() => {
        fetchEmployees(1);
    }, [fetchEmployees]);

    // ===========================
    // Search
    // ===========================

    const handleSearch = () => {
        setAppliedSearch(search);
        fetchEmployees(
            1,
            search,
            status,
            employmentType
        );
    };

    // ===========================
    // Status Filter
    // ===========================

    const handleStatusChange = (value) => {
        setStatus(value);

        fetchEmployees(
            1,
            appliedSearch,
            value,
            employmentType
        );
    };

    // ===========================
    // Employment Filter
    // ===========================

    const handleEmploymentTypeChange = (
        value
    ) => {
        setEmploymentType(value);

        fetchEmployees(
            1,
            appliedSearch,
            status,
            value
        );
    };

    // ===========================
    // Reset Filters
    // ===========================

    const handleReset = () => {
        setSearch("");
        setAppliedSearch("");
        setStatus("");
        setEmploymentType("");

        fetchEmployees(1, "", "", "");
    };

    // ===========================
    // Delete Employee
    // ===========================

    const handleDelete = async (employee) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${employee.firstName} ${employee.lastName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await apiRequest(
                `/employees/${employee._id}`,
                {
                    method: "DELETE",
                }
            );

            await fetchEmployees(
                pagination.page,
                appliedSearch,
                status,
                employmentType
            );
        } catch (error) {
            setError(
                error.message ||
                "Unable to delete employee."
            );
        }
    };

    // ===========================
    // Statistics
    // ===========================

    const activeCount = employees.filter(
        (employee) =>
            employee.status === "active"
    ).length;

    const inactiveCount = employees.filter(
        (employee) =>
            employee.status === "inactive"
    ).length;

    const leaveCount = employees.filter(
        (employee) =>
            employee.status === "on_leave"
    ).length;

    // ===========================
    // Initial Loading
    // ===========================

    if (loading && employees.length === 0) {
        return <LoadingSpinner />;
    }

    // ===========================
    // Page
    // ===========================

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-slate-400">
                        People
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Employees
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your organization&apos;s employees.
                    </p>
                </div>

                <Link
                    href="/employees/new"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus size={17} />
                    Add Employee
                </Link>
            </div>

            {/* Stats */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Stat
                    title="Total Employees"
                    value={pagination.total}
                    icon={Users}
                />

                <Stat
                    title="Active"
                    value={activeCount}
                    icon={UserCheck}
                />

                <Stat
                    title="On Leave"
                    value={leaveCount}
                    icon={CalendarDays}
                />

                <Stat
                    title="Inactive"
                    value={inactiveCount}
                    icon={UserX}
                />
            </div>

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Filters */}

            <EmployeeFilters
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                status={status}
                setStatus={handleStatusChange}
                employmentType={employmentType}
                setEmploymentType={
                    handleEmploymentTypeChange
                }
                onReset={handleReset}
            />

            {/* Table */}

            <EmployeeTable
                employees={employees}
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
                                fetchEmployees(
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
                                fetchEmployees(
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

// ===========================
// Statistic Card
// ===========================

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