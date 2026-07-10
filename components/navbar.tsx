"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X, Flame, Bell, User, PlusCircle, Compass } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock state for now

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 transition-colors">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-neutral-900 dark:text-white group">
          <div className="bg-emerald-100 dark:bg-emerald-950/50 p-1.5 rounded-lg group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
          </div>
          <span>FundForge</span>
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
            <Compass className="w-4 h-4" /> Explore
          </Link>
          
          <Link href="/create" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
             <PlusCircle className="w-4 h-4" /> Start a Campaign
          </Link>

          <div className="h-5 w-px bg-neutral-200 dark:bg-neutral-800"></div>
          
          {isLoggedIn ? (
             <div className="flex items-center gap-4">
                <button className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors relative">
                   <Bell className="w-5 h-5" />
                   <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white ring-2 ring-white dark:ring-neutral-950">2</span>
                </button>
                <button className="flex items-center gap-2 text-sm font-medium border border-neutral-200 dark:border-neutral-800 rounded-full py-1.5 px-3 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-white transition-colors">
                  <User className="w-4 h-4" /> Profile
                </button>
             </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-900">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 rounded-full transition-colors shadow-sm shadow-emerald-600/20">
                Sign up
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
            <Link href="/create" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
               <PlusCircle className="w-5 h-5 text-neutral-500" /> Start a Campaign
            </Link>
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
                  <Link href="/profile" className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
                    <User className="w-5 h-5 text-neutral-500" /> Profile
                  </Link>
               </div>
             ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                   <Link href="/login" className="flex items-center justify-center text-sm font-medium border border-neutral-200 dark:border-neutral-800 px-4 py-2.5 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors">
                      Log in
                   </Link>
                   <Link href="/signup" className="flex items-center justify-center text-sm font-medium bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                      Sign up
                   </Link>
                </div>
             )}
          </div>
        </div>
      )}
    </header>
  );
}
