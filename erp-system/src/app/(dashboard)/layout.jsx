"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import apiRequest from "@/lib/api";
import DashboardShell from "@/components/dashboard/DashboardShell";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function DashboardLayout({
    children,
}) {
    const router = useRouter();
    const pathname = usePathname();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await apiRequest("/auth/me");

                setUser(response.data);
            } catch {
                router.replace("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuthentication();
    }, [router, pathname]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return null;
    }

    return (
        <DashboardShell user={user}>
            {children}
        </DashboardShell>
    );
}