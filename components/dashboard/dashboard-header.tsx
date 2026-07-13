"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import { NotificationsDropdown } from "../notifications-dropdown";

interface DashboardHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function DashboardHeader({ isMobileMenuOpen, setIsMobileMenuOpen }: DashboardHeaderProps) {
  const { data: session } = useSession();

  return (
    <header className="h-20 px-6 flex items-center justify-between text-white  dark:border-transparent">
      {/* Left: Logo */}
      <div className="flex items-center gap-4 w-64 shrink-0">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <Image 
            src="/assets/logo-dashboard-light1.png" 
            alt="FundForge Logo" 
            width={160} 
            height={40} 
            className="h-6 md:h-8 w-auto object-contain drop-shadow-sm dark:hidden" 
            priority
          />
          <Image 
            src="/assets/nav-logo-dark.png" 
            alt="FundForge Logo" 
            width={160} 
            height={40} 
            className="h-6 md:h-8 w-auto object-contain drop-shadow-sm hidden dark:block" 
            priority
          />
        </Link>
      </div>



      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6 justify-end">
        <NotificationsDropdown isDashboardHeader={true} />

        <div className="flex items-center gap-3 ml-2">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-white leading-tight">{session?.user?.name || "Loading..."}</span>
              <span className="text-[11px] text-emerald-100 dark:text-emerald-300 font-medium leading-tight capitalize">{(session?.user as any)?.role || "Supporter"}</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-emerald-800 border-2 border-white/20 overflow-hidden shrink-0">
             {session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
             )}
           </div>
        </div>
        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
           {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>
    </header>
  );
}
