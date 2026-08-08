"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Employees",
    href: "/employees",
  },
  {
    label: "Attendance",
    href: "/attendance",
  },
  {
    label: "Leave",
    href: "/leave",
  },
  {
    label: "Payroll",
    href: "/payroll",
  },
  {
    label: "Customers",
    href: "/customers",
  },
  {
    label: "Suppliers",
    href: "/suppliers",
  },
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Inventory",
    href: "/inventory",
  },
  {
    label: "Purchases",
    href: "/purchases",
  },
  {
    label: "Sales",
    href: "/sales",
  },
  {
    label: "Finance",
    href: "/finance",
  },
  {
    label: "Reports",
    href: "/reports",
  },
  {
    label: "Settings",
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-white lg:block">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href="/dashboard"
          className="text-xl font-bold"
        >
          ERP System
        </Link>
      </div>

      <nav className="space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}