import Link from "next/link";
import { SearchX, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* 404 Visual */}
        <div className="relative mb-10 flex justify-center items-center">
          <h1 className="text-[12rem] font-black text-neutral-100 dark:text-neutral-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white dark:bg-[#0a0a0a] p-4 rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-800">
              <SearchX className="w-16 h-16 text-emerald-500" />
            </div>
          </div>
        </div>
        
        {/* Text Content */}
        <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
          Page Not Found
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-10 text-lg">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track!
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <Home className="w-5 h-5" /> Return Home
          </Link>
          
          <Link
            href="/explore"
            className="px-8 py-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-bold rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" /> Explore Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
}
