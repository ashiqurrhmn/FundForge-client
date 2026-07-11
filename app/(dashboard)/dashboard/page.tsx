"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";
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

  if (isPending) {
    return <DashboardSkeleton />;
  }

  return null;
}
