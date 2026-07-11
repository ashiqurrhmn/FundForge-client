"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { SupporterDashboard } from "@/components/dashboard/supporter-dashboard";

export default function SupporterDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-900 border-t-emerald-600 dark:border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return <SupporterDashboard user={session.user} />;
}
