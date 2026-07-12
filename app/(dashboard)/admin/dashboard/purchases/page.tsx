"use client";

import { useState, useEffect } from "react";
import { Loader2, CreditCard, Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/purchases`);
        const data = await res.json();
        if (data.success) {
          setPurchases(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin purchases", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter(p => {
    const matchesSearch = !searchQuery || 
      p.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packageName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1 flex items-center gap-3">
          <CreditCard className="w-8 h-8 text-emerald-500" /> Supporter Purchases
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Global ledger of all credit packages purchased via Stripe
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["All", "succeeded", "pending", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  statusFilter === status
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search email or package..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {filteredPurchases.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-12 h-12 text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-white mb-1">No purchases found</h3>
            <p className="text-sm text-neutral-500">
              {searchQuery || statusFilter !== "All" ? "Try adjusting your search criteria." : "No credit packages have been purchased yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Supporter Email</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Package</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Credits Added</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Price Paid (USD)</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map((p, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    key={p._id} 
                    className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-5 px-4 text-xs font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                      {new Date(p.paymentDate || new Date()).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-4">
                      <p className="text-sm font-bold text-neutral-800 dark:text-white truncate max-w-[200px]">
                        {p.userEmail}
                      </p>
                    </td>
                    <td className="py-5 px-4">
                      <span className="text-sm font-bold text-neutral-800 dark:text-white">
                        {p.packageName}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-sm font-black text-emerald-500 whitespace-nowrap">
                      +{p.creditsPurchased?.toLocaleString()} Cr
                    </td>
                    <td className="py-5 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      ${p.amountPaid?.toFixed(2)}
                    </td>
                    <td className="py-5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        p.status === "succeeded" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        p.status === "pending" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                        "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
