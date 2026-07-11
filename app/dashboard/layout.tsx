"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Search, Bell, MessageSquare, Menu, X, 
  Home, Compass, Heart, CreditCard, ReceiptText, LogOut 
} from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

const SIDEBAR_ITEMS = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Explore", href: "/dashboard/explore", icon: Compass },
  { name: "My Contributions", href: "/dashboard/contributions", icon: Heart },
  { name: "Purchase Credit", href: "/dashboard/credits", icon: CreditCard },
  { name: "Payment History", href: "/dashboard/payments", icon: ReceiptText },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-emerald-900 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-20 px-6 flex items-center justify-between text-white">
        {/* Left: Logo */}
        <div className="flex items-center gap-4 w-64 shrink-0">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image 
              src="/assets/nav-logo-dark.png" 
              alt="FundForge Logo" 
              width={160} 
              height={40} 
              className="h-6 md:h-8 w-auto object-contain drop-shadow-sm" 
              priority
            />
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 hidden md:flex items-center ml-4">
           <div className="relative w-full max-w-lg bg-emerald-950/40 hover:bg-emerald-950/60 focus-within:bg-emerald-950/60 transition-all rounded-xl px-4 py-2.5 flex items-center gap-3 border border-emerald-800/50 focus-within:border-emerald-500/50 shadow-inner group">
              <Search className="w-4 h-4 text-emerald-300 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="text" 
                placeholder="What do you want to fund today?" 
                className="bg-transparent border-none outline-none text-white placeholder:text-emerald-300/60 w-full text-sm font-medium"
              />
           </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-4 sm:gap-6 justify-end">
          <button className="relative text-emerald-100 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-500"></span>
          </button>
          <button className="relative text-emerald-100 hover:text-white transition-colors hidden sm:block">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-emerald-600 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-emerald-500">3</span>
          </button>
          <div className="flex items-center gap-3 ml-2">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-white leading-tight">{session?.user?.name || "Loading..."}</span>
                <span className="text-[11px] text-emerald-300 font-medium leading-tight capitalize">{(session?.user as any)?.role || "Supporter"}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-white/20 overflow-hidden shrink-0">
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

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-white dark:bg-neutral-950 rounded-t-[2.5rem] lg:rounded-tl-[2.5rem] lg:rounded-tr-none lg:mr-0 ml-0 lg:ml-2 shadow-2xl relative z-10">
        
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
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 translate-x-1"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-500/80"}`} />
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
              <LogOut className="w-5 h-5 text-emerald-500/80 group-hover:text-red-500" />
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
                           ? "bg-emerald-500 text-white shadow-md"
                           : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900"
                       }`}
                     >
                       <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-500/80"}`} />
                       {item.name}
                     </Link>
                   );
                 })}
               </nav>
             </aside>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 h-full overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900/20 pb-24 lg:pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
