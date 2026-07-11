"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#00BC7D] dark:bg-emerald-900 flex flex-col font-sans">
      <DashboardHeader 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-neutral-950 rounded-t-[2.5rem] lg:rounded-tl-[2.5rem] lg:rounded-tr-none lg:mr-0 ml-0 lg:ml-2 shadow-2xl relative z-10">
        
        <DashboardSidebar 
          isMobileMenuOpen={isMobileMenuOpen} 
          setIsMobileMenuOpen={setIsMobileMenuOpen} 
        />

        {/* Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900/20 pb-24 lg:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
