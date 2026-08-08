"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiRequest from "@/lib/api";

export default function DashboardPage() {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const response = await apiRequest("/auth/me");

                setUser(response.data);
            } catch (error) {
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, [router]);

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

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center">
                <p>Loading...</p>
            </main>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold">
                ERP Dashboard
            </h1>

            <p className="mt-4">
                Welcome, {user.firstName} {user.lastName}
            </p>

            <p className="mt-2 text-gray-500">
                Role: {user.role}
            </p>

            <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
                Logout
            </button>
        </main>
    );
}