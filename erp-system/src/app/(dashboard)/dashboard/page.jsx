"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserRoundCheck,
  Package,
  Wallet,
} from "lucide-react";

import apiRequest from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import SalesOverview from "@/components/dashboard/SalesOverview";
import InventorySummary from "@/components/dashboard/InventorySummary";
import RecentActivity from "@/components/dashboard/RecentActivity";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function DashboardPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await apiRequest(
          "/dashboard/overview"
        );

        setOverview(response.data);
      } catch (error) {
        setError(
          error.message ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div>
        <p className="text-sm font-medium text-slate-400">
          Overview
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here`&apos;`s what`&apos;`s happening across your business today.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={overview?.employees?.total ?? 0}
          description="Registered employees"
          icon={Users}
        />

        <StatCard
          title="Active Employees"
          value={overview?.employees?.active ?? 0}
          description="Currently active"
          icon={UserRoundCheck}
        />

        <StatCard
          title="Total Products"
          value={
            overview?.products?.total ?? "—"
          }
          description={
            overview?.products
              ? "Registered products"
              : "Coming soon"
          }
          icon={Package}
        />

        <StatCard
          title="Monthly Revenue"
          value={
            overview?.sales?.monthlyRevenue
              ? `৳${overview.sales.monthlyRevenue.toLocaleString()}`
              : "—"
          }
          description={
            overview?.sales
              ? "Current month"
              : "Coming soon"
          }
          icon={Wallet}
        />
      </div>

      {/* Business Overview */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SalesOverview />

        <InventorySummary />
      </div>

      {/* Recent Activity */}

      <RecentActivity />
    </div>
  );
}