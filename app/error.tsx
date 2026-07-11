"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-10 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-3 tracking-tight">
          Oops, something went wrong!
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-medium">
          We encountered an unexpected error. Please try again or go back to the homepage.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            <RefreshCcw className="w-5 h-5" /> Try Again
          </button>
          
          <Link
            href="/"
            className="w-full py-3.5 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 font-bold rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
