"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, Flame, Bell, User, PlusCircle, Compass, LogOut } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data, isPending} = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = data?.user;
  const isLoggedIn = !!user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900 dark:text-white group hover:opacity-80 transition-opacity">
          {/* Light mode logo (hidden in dark mode) */}
          <Image 
            src="/assets/nav-logo-light.png" 
            alt="FundForge Logo" 
            width={160} 
            height={40} 
            className="h-5 md:h-7 w-auto object-contain dark:hidden drop-shadow-sm transition-all" 
            priority
          />
          {/* Dark mode logo (hidden in light mode) */}
          <Image 
            src="/assets/nav-logo-dark.png" 
            alt="FundForge Logo" 
            width={160} 
            height={40} 
            className="h-5 md:h-7 w-auto object-contain hidden dark:block transition-all" 
            priority
          />
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500 dark:text-neutral-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-500 transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Discover campaigns..."
              className="flex h-10 w-full rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 pl-10 text-sm ring-offset-white dark:ring-offset-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:bg-white dark:focus-visible:bg-neutral-950 transition-all text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Explore Campaigns
          </Link>
          
          {isLoggedIn && (
            <Link href="/create" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
               <PlusCircle className="w-4 h-4" /> Start a Campaign
            </Link>
          )}

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>
          
          {isLoggedIn ? (
             <div className="flex items-center gap-4">
                <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative">
                   <Bell className="w-5 h-5" />
                   <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">2</span>
                </button>
                <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-full py-1.5 px-3 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-4 h-4 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {user.name}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-full py-1.5 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/30 dark:hover:text-red-500 dark:hover:border-red-900/50 text-neutral-600 dark:text-neutral-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
             </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="https://github.com/ashiqurrhmn/FundForge-client" target="_blank" rel="noopener noreferrer" className="text-sm font-medium border border-neutral-200 dark:border-neutral-800 px-4 py-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <svg className="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg> Join as Developer
              </a>
              <Link href="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900">
                Login
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-emerald-600/20">
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4 space-y-4 shadow-lg">
           <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Discover campaigns..."
              className="flex h-11 w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 pl-10 text-sm ring-offset-white dark:ring-offset-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 text-neutral-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Link href="/explore" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
              <Compass className="w-5 h-5 text-neutral-500" /> Explore Campaigns
            </Link>
            {isLoggedIn && (
              <Link href="/create" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                 <PlusCircle className="w-5 h-5 text-neutral-500" /> Start a Campaign
              </Link>
            )}
          </div>
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4">
             {isLoggedIn ? (
               <div className="flex flex-col gap-1">
                  <Link href="/notifications" className="flex items-center justify-between text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                     <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-neutral-500" /> Notifications
                     </div>
                     <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-500 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                  </Link>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-neutral-900 dark:text-white bg-neutral-50 dark:bg-neutral-900 rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                    )}
                    {user.name}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
               </div>
             ) : (
                <div className="flex flex-col gap-3 pt-2">
                   <a href="https://github.com/ashiqurrhmn/FundForge-client" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors mt-2">
                      <svg className="w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg> Join as Developer
                   </a>
                   <div className="grid grid-cols-2 gap-3">
                     <Link href="/login" className="flex items-center justify-center text-sm font-medium border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                        Login
                     </Link>
                     <Link href="/signup" className="flex items-center justify-center text-sm font-medium bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                        Register
                     </Link>
                   </div>
                </div>
             )}
          </div>
        </div>
      )}
    </header>
  );
}
