"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login, signup, and dashboard pages
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/dashboard")) {
    return null;
  }
  
  return <Navbar />;
}
