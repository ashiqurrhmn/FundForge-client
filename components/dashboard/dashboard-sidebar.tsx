"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, CreditCard, ReceiptText, LogOut, X, PlusCircle, Layers, Landmark, ShieldCheck, Users, PieChart } from "lucide-react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

// Import useSession removed from here to top

export const SUPPORTER_SIDEBAR_ITEMS = [
  { name: "Home", href: "/supporter/dashboard", icon: Home },
  { name: "Explore", href: "/supporter/dashboard/explore", icon: Compass },
  { name: "My Contributions", href: "/supporter/dashboard/contributions", icon: Heart },
  { name: "Purchase Credit", href: "/supporter/dashboard/credits", icon: CreditCard },
  { name: "Payment History", href: "/supporter/dashboard/payments", icon: ReceiptText },
];

export const CREATOR_SIDEBAR_ITEMS = [
  { name: "Home", href: "/creator/dashboard", icon: Home },
  { name: "Add New Campaign", href: "/creator/dashboard/create", icon: PlusCircle },
  { name: "My Campaigns", href: "/creator/dashboard/my-campaigns", icon: Layers },
  { name: "Withdrawals", href: "/creator/dashboard/withdrawals", icon: Landmark },
  { name: "Payment History", href: "/creator/dashboard/payments", icon: ReceiptText },
];

export const ADMIN_SIDEBAR_ITEMS = [
  { name: "Home", href: "/admin/dashboard", icon: Home },
  { name: "Manage Users", href: "/admin/dashboard/users", icon: Users },
  { name: "Manage Campaigns", href: "/admin/dashboard/campaigns", icon: ShieldCheck },
  { name: "Withdrawal Requests", href: "/admin/dashboard/withdrawals", icon: Landmark },
  { name: "Reports", href: "/admin/dashboard/reports", icon: PieChart },
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
  const SIDEBAR_ITEMS = role === "admin" ? ADMIN_SIDEBAR_ITEMS : role === "creator" ? CREATOR_SIDEBAR_ITEMS : SUPPORTER_SIDEBAR_ITEMS;

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
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20 dark:ring-emerald-400/20"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"}`} />
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
            <LogOut className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-red-500 transition-colors" />
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
                         ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20 dark:ring-emerald-400/20"
                         : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                     }`}
                   >
                     <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"}`} />
                     {item.name}
                   </Link>
                 );
               })}
               
               <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                 <button 
                   onClick={handleLogout}
                   className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-2xl font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                 >
                   <LogOut className="w-5 h-5 text-neutral-400 dark:text-neutral-500 group-hover:text-red-500 transition-colors" />
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

