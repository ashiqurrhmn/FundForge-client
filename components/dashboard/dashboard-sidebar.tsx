"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Heart, CreditCard, ReceiptText, LogOut, X, PlusCircle, Layers, Landmark, ShieldCheck, Users, PieChart, ChevronLeft, ChevronRight, GripVertical, HandCoins } from "lucide-react";
import { authClient, useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

// Import useSession removed from here to top

export const SUPPORTER_SIDEBAR_ITEMS = [
  { name: "Home", href: "/supporter/dashboard", icon: Home },
  { name: "Explore", href: "/explore", icon: Compass },
  { name: "My Contributions", href: "/supporter/dashboard/contributions", icon: Heart },
  { name: "Purchase Credit", href: "/supporter/dashboard/credits", icon: CreditCard },
  { name: "Payment History", href: "/supporter/dashboard/payments", icon: ReceiptText },
];

export const CREATOR_SIDEBAR_ITEMS = [
  { name: "Home", href: "/creator/dashboard", icon: Home },
  { name: "Add New Campaign", href: "/creator/dashboard/create", icon: PlusCircle },
  { name: "My Campaigns", href: "/creator/dashboard/my-campaigns", icon: Layers },
  { name: "Contributions", href: "/creator/dashboard/contributions", icon: HandCoins },
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const startResizing = useCallback(() => {
    setIsResizing(true);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth > 150 && newWidth < 400) {
           setSidebarWidth(newWidth);
           if (isCollapsed) setIsCollapsed(false);
        } else if (newWidth <= 150 && !isCollapsed) {
           setIsCollapsed(true);
        }
      }
    },
    [isResizing, isCollapsed]
  );

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);
  
  const role = (session?.user as any)?.role || "supporter";
  const SIDEBAR_ITEMS = role === "admin" ? ADMIN_SIDEBAR_ITEMS : role === "creator" ? CREATOR_SIDEBAR_ITEMS : SUPPORTER_SIDEBAR_ITEMS;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        ref={sidebarRef}
        style={{ width: isCollapsed ? '96px' : `${sidebarWidth}px` }}
        className={`relative shrink-0 hidden lg:flex flex-col border-r border-neutral-100 dark:border-neutral-800/50 bg-white dark:bg-neutral-950 z-20 h-full ${!isResizing ? "transition-all duration-300 ease-in-out" : ""}`}
      >
        {/* Resize Handle */}
        <div 
          onMouseDown={startResizing}
          className="absolute -right-2 top-0 bottom-0 w-4 cursor-col-resize flex items-center justify-center group z-50"
        >
          <div className="h-8 w-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full group-hover:bg-emerald-400 group-active:bg-emerald-500 group-hover:scale-y-110 transition-all flex items-center justify-center shadow-sm overflow-hidden">
             <GripVertical className="w-3 h-3 text-neutral-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        
        <div className={`flex flex-col h-full overflow-y-auto overflow-x-hidden py-8 ${isCollapsed ? "px-4" : "px-6"}`}>
        <nav className="flex-1 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-4"} py-3.5 rounded-2xl font-medium transition-all ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm ring-1 ring-emerald-500/20 dark:ring-emerald-400/20"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400 dark:text-neutral-500"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-8 border-t border-neutral-100 dark:border-neutral-800/50 flex flex-col gap-2">
          <button 
            onClick={handleLogout}
            title={isCollapsed ? "Log out" : undefined}
            className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-4"} py-3 w-full text-left rounded-2xl font-medium text-neutral-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all`}
          >
            <LogOut className="w-5 h-5 shrink-0 text-neutral-400 dark:text-neutral-500 group-hover:text-red-500 transition-colors" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
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

