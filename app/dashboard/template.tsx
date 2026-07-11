import { PageTransition } from "@/components/page-transition";
import { ReactNode } from "react";

export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return (
    <PageTransition className="h-full w-full">
      {children}
    </PageTransition>
  );
}
