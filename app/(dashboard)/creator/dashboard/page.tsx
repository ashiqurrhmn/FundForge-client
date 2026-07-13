"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { CreatorDashboard } from "@/components/dashboard/creator-dashboard";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
import { Toaster } from "react-hot-toast";

export default function CreatorDashboardPage() {
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

  return (
    <>
      <Toaster position="top-center" />
      <CreatorDashboard user={session.user} />
    </>
  );
}
