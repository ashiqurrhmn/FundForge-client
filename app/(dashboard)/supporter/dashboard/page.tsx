"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { SupporterDashboard } from "@/components/dashboard/supporter-dashboard";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function SupporterDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (!session) return null;

  return <SupporterDashboard user={session.user} />;
}
