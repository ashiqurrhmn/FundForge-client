import { PageTransition } from "@/components/page-transition";
import { ReactNode } from "react";

export default function LoginTemplate({ children }: { children: ReactNode }) {
  return (
    <PageTransition className="flex-1 flex flex-col">
      {children}
    </PageTransition>
  );
}
