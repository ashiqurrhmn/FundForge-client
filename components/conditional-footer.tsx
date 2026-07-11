"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide navbar on login, signup, and dashboard pages
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard") || pathname.startsWith("/creator/dashboard") || pathname.startsWith("/supporter/dashboard") || pathname.startsWith("/admin/dashboard")) {
    return null;
  }
  
  return <Footer />;
}
