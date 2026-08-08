"use client";

import { useRouter } from "next/navigation";
import apiRequest from "@/lib/api";

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });

      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
      <div>
        <h2 className="text-lg font-semibold">
          ERP Management System
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="text-xs text-gray-500">
            {user?.role}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}