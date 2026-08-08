import {
  Users,
  UserRoundCheck,
  Package,
  Wallet,
} from "lucide-react";

import StatCard from "@/components/dashboard/StatCard";
import SalesOverview from "@/components/dashboard/SalesOverview";
import InventorySummary from "@/components/dashboard/InventorySummary";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
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
          Here`&apos;` what``&apos;``s happening across your business today.
        </p>
      </div>

      {/* KPI Cards */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Employees"
          value="248"
          description="from last month"
          trend="+8.2%"
          trendType="positive"
          icon={Users}
        />

        <StatCard
          title="Attendance"
          value="94.6%"
          description="this month"
          trend="+2.4%"
          trendType="positive"
          icon={UserRoundCheck}
        />

        <StatCard
          title="Total Products"
          value="1,580"
          description="in inventory"
          trend="+5.1%"
          trendType="positive"
          icon={Package}
        />

        <StatCard
          title="Monthly Revenue"
          value="৳6.8M"
          description="from last month"
          trend="+12.5%"
          trendType="positive"
          icon={Wallet}
        />
      </div>

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <SalesOverview />

        <InventorySummary />
      </div>

      {/* Recent Activity */}

      <RecentActivity />
    </div>
  );
}