import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Visual Icon */}
        <div className="relative mb-10 flex justify-center items-center">
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 dark:bg-red-500/5 blur-3xl w-48 h-48 rounded-full mx-auto" />
          <div className="relative bg-white dark:bg-[#0a0a0a] p-6 rounded-full shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <ShieldAlert className="w-20 h-20 text-red-500" />
          </div>
        </div>
        
        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">
          Access Denied
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-10 text-lg">
          You don't have the required permissions to view this page. If you believe this is a mistake, please contact support or log in with a different account.
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
            href="/login"
            className="px-8 py-4 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-bold rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" /> Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
