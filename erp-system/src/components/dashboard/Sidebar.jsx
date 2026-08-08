"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserRoundCheck,
  CalendarDays,
  WalletCards,
  UserRound,
  Truck,
  Package,
  Boxes,
  ShoppingCart,
  Receipt,
  Landmark,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigationGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        label: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        label: "Attendance",
        href: "/attendance",
        icon: UserRoundCheck,
      },
      {
        label: "Leave",
        href: "/leave",
        icon: CalendarDays,
      },
      {
        label: "Payroll",
        href: "/payroll",
        icon: WalletCards,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        label: "Customers",
        href: "/customers",
        icon: UserRound,
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        icon: Truck,
      },
      {
        label: "Products",
        href: "/products",
        icon: Package,
      },
      {
        label: "Inventory",
        href: "/inventory",
        icon: Boxes,
      },
      {
        label: "Purchases",
        href: "/purchases",
        icon: ShoppingCart,
      },
      {
        label: "Sales",
        href: "/sales",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Finance",
        href: "/finance",
        icon: Landmark,
      },
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col
          border-r border-slate-200 bg-white
          transition-all duration-300
          lg:z-30
          ${collapsed ? "lg:w-19" : "lg:w-65"}
          ${
            mobileOpen
              ? "translate-x-0 w-70"
              : "-translate-x-full w-70"
          }
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div
          className={`
            flex h-16 shrink-0 items-center border-b
            border-slate-200
            ${
              collapsed
                ? "justify-center px-3"
                : "justify-between px-5"
            }
          `}
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
              E
            </div>

            {!collapsed && (
              <div>
                <p className="text-sm font-bold tracking-tight text-slate-900">
                  ERP System
                </p>

                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                  Management
                </p>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:flex"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={17} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {collapsed && (
            <button
              type="button"
              onClick={() => setCollapsed(false)}
              className="mb-5 hidden w-full items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:flex"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          )}

          {navigationGroups.map((group) => (
            <div key={group.title} className="mb-6">
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      className={`
                        group flex items-center rounded-xl
                        text-sm font-medium transition-all
                        ${
                          collapsed
                            ? "justify-center px-2 py-3"
                            : "gap-3 px-3 py-2.5"
                        }
                        ${
                          active
                            ? "bg-slate-900 text-white shadow-sm"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                      `}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={
                          active
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        }
                      />

                      {!collapsed && (
                        <span>{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom area */}
        <div className="shrink-0 border-t border-slate-200 p-3">
          {!collapsed ? (
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-700">
                ERP Management
              </p>

              <p className="mt-1 text-[11px] leading-4 text-slate-400">
                Manage your business from one place.
              </p>
            </div>
          ) : (
            <div className="flex justify-center py-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}