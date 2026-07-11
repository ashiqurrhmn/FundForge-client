"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, CreditCard, ReceiptText, LogOut, X, PlusCircle, Layers, Landmark } from "lucide-react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

// Import useSession removed from here to top

export const SUPPORTER_SIDEBAR_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/dashboard/explore", icon: Compass },
  { name: "My Contributions", href: "/dashboard/contributions", icon: Heart },
  { name: "Purchase Credit", href: "/dashboard/credits", icon: CreditCard },
  { name: "Payment History", href: "/dashboard/payments", icon: ReceiptText },
];

export const CREATOR_SIDEBAR_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Add New Campaign", href: "/create", icon: PlusCircle },
  { name: "My Campaigns", href: "/dashboard/my-campaigns", icon: Layers },
  { name: "Withdrawals", href: "/dashboard/withdrawals", icon: Landmark },
  { name: "Payment History", href: "/dashboard/payments", icon: ReceiptText },
];

interface DashboardSidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export function DashboardSidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  
  const role = (session?.user as any)?.role || "supporter";
  const SIDEBAR_ITEMS = role === "creator" ? CREATOR_SIDEBAR_ITEMS : SUPPORTER_SIDEBAR_ITEMS;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 shrink-0 hidden lg:flex flex-col border-r border-neutral-100 dark:border-neutral-800/50 py-8 px-6 bg-white dark:bg-neutral-950 z-20 h-full overflow-y-auto">
        <nav className="flex-1 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all ${
                  isActive
                    ? "bg-emerald-500 dark:bg-[#009966] text-white shadow-md shadow-emerald-500/20 dark:shadow-[#009966]/20 translate-x-1"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-500/80 dark:text-[#009966]/80"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-neutral-100 dark:border-neutral-800/50">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <LogOut className="w-5 h-5 text-emerald-500/80 dark:text-[#009966]/80 group-hover:text-red-500" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end" onClick={() => setIsMobileMenuOpen(false)}>
           <aside className="w-64 h-full bg-white dark:bg-neutral-950 p-6 flex flex-col shadow-2xl animate-in slide-in-from-right" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
             </div>
             <nav className="flex-1 space-y-2">
               {SIDEBAR_ITEMS.map((item) => {
                 const isActive = pathname === item.href;
                 return (
                   <Link
                     key={item.name}
                     href={item.href}
                     onClick={() => setIsMobileMenuOpen(false)}
                     className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                       isActive
                         ? "bg-emerald-500 dark:bg-[#009966] text-white shadow-md"
                         : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                     }`}
                   >
                     <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-500/80 dark:text-[#009966]/80"}`} />
                     {item.name}
                   </Link>
                 );
               })}
               
               <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                 <button 
                   onClick={handleLogout}
                   className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                 >
                   <LogOut className="w-5 h-5 text-emerald-500/80 dark:text-[#009966]/80 group-hover:text-red-500" />
                   Log out
                 </button>
               </div>
             </nav>
           </aside>
        </div>
      )}
    </>
  );
}
