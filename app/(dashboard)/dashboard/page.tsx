"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";

export default function DashboardRedirector() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/login");
      } else {
        const userRole = (session.user as any).role || "supporter";
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else if (userRole === "creator") {
          router.push("/creator/dashboard");
        } else {
          router.push("/supporter/dashboard");
        }
      }
    }
  }, [isPending, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );
}
