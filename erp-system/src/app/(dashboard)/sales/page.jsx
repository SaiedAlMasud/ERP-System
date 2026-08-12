"use client";

import {
    useCallback,
    useEffect,
    useState,
} from "react";

import Link from "next/link";

import {
    Plus,
    Receipt,
    CheckCircle2,
    Clock3,
} from "lucide-react";

import apiRequest from "@/lib/api";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import SaleTable from "@/components/sales/SaleTable";
import SaleFilters from "@/components/sales/SaleFilters";

export default function SalesPage() {
    const [sales, setSales] =
        useState([]);

    const [pagination, setPagination] =
        useState({
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false,
        });

    const [search, setSearch] =
        useState("");

    const [appliedSearch, setAppliedSearch] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchSales = useCallback(
        async (
            page = 1,
            searchValue = appliedSearch,
            statusValue = status,
            paymentStatusValue = paymentStatus
        ) => {
            setLoading(true);
            setError("");

            try {
                const params =
                    new URLSearchParams({
                        page: String(page),
                        limit: "10",
                    });

                if (searchValue) {
                    params.set(
                        "search",
                        searchValue
                    );
                }

                if (statusValue) {
                    params.set(
                        "status",
                        statusValue
                    );
                }

                if (paymentStatusValue) {
                    params.set(
                        "paymentStatus",
                        paymentStatusValue
                    );
                }

                const response =
                    await apiRequest(
                        `/sales?${params.toString()}`
                    );

                setSales(
                    response.data?.sales || []
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
                    "Unable to load sales."
                );
            } finally {
                setLoading(false);
            }
        },
        [
            appliedSearch,
            status,
            paymentStatus,
        ]
    );

    useEffect(() => {
        fetchSales(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = () => {
        setAppliedSearch(search);

        fetchSales(
            1,
            search,
            status,
            paymentStatus
        );
    };

    const handleStatusChange = (
        value
    ) => {
        setStatus(value);

        fetchSales(
            1,
            appliedSearch,
            value,
            paymentStatus
        );
    };

    const handlePaymentStatusChange = (
        value
    ) => {
        setPaymentStatus(value);

        fetchSales(
            1,
            appliedSearch,
            status,
            value
        );
    };

    const handleReset = () => {
        setSearch("");
        setAppliedSearch("");
        setStatus("");
        setPaymentStatus("");

        fetchSales(
            1,
            "",
            "",
            ""
        );
    };

    const completedCount =
        sales.filter(
            (sale) =>
                sale.status === "completed"
        ).length;

    const pendingCount =
        sales.filter(
            (sale) =>
                sale.status === "pending"
        ).length;

    if (
        loading &&
        sales.length === 0
    ) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                    <p className="text-sm font-medium text-slate-400">
                        Transactions
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Sales
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your sales and invoices.
                    </p>
                </div>

                <Link
                    href="/sales/new"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                    <Plus size={17} />
                    New Sale
                </Link>
            </div>

            {/* Stats */}

            <div className="grid gap-4 sm:grid-cols-3">
                <Stat
                    title="Total Sales"
                    value={pagination.total}
                    icon={Receipt}
                />

                <Stat
                    title="Completed"
                    value={completedCount}
                    icon={CheckCircle2}
                />

                <Stat
                    title="Pending"
                    value={pendingCount}
                    icon={Clock3}
                />
            </div>

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Filters */}

            <SaleFilters
                search={search}
                setSearch={setSearch}
                onSearch={handleSearch}
                status={status}
                setStatus={handleStatusChange}
                paymentStatus={paymentStatus}
                setPaymentStatus={
                    handlePaymentStatusChange
                }
                onReset={handleReset}
            />

            {/* Table */}

            <SaleTable sales={sales} />

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
                                fetchSales(
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
                                fetchSales(
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