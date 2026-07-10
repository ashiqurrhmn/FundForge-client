"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on login and signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }
  
  return <Navbar />;
}
