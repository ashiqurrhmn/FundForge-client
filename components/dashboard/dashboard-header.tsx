"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, MessageSquare, Menu, X } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";

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

      {/* Center: Search */}
      <div className="flex-1 hidden md:flex items-center ml-4">
         <div className="relative w-full max-w-lg bg-black/10 dark:bg-emerald-950/40 hover:bg-black/20 dark:hover:bg-emerald-950/60 focus-within:bg-black/20 dark:focus-within:bg-emerald-950/60 transition-all rounded-xl px-4 py-2.5 flex items-center gap-3 border border-transparent dark:border-emerald-800/50 focus-within:border-white/30 dark:focus-within:border-emerald-500/50 shadow-inner group">
            <Search className="w-4 h-4 text-emerald-100 dark:text-emerald-300 group-focus-within:text-white dark:group-focus-within:text-emerald-400 transition-colors" />
            <input 
              type="text" 
              placeholder="What do you want to fund today?" 
              className="bg-transparent border-none outline-none text-white placeholder:text-emerald-100/70 dark:placeholder:text-emerald-300/60 w-full text-sm font-medium"
            />
         </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4 sm:gap-6 justify-end">
        <button className="relative text-emerald-100 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#00BC7D] dark:border-emerald-500"></span>
        </button>
        <button className="relative text-emerald-100 hover:text-white transition-colors hidden sm:block">
          <MessageSquare className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-emerald-600 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#00BC7D] dark:border-emerald-500">3</span>
        </button>
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
