"use client";

import { useState, useEffect } from "react";
import { Loader2, ReceiptText, Search, CreditCard, ExternalLink } from "lucide-react";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminPaymentHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contributions`);
        const data = await res.json();
        if (data.success) {
          setPayments(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch admin payment history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = !searchQuery || 
      p.campaignTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supporterEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    
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
          <ReceiptText className="w-8 h-8 text-emerald-500" /> Contribution transactions
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Global ledger of all supporter contributions across the platform
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        
        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["All", "Approved", "Pending", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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
              placeholder="Search email or campaign..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-12 h-12 text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-white mb-1">No transactions found</h3>
            <p className="text-sm text-neutral-500">
              {searchQuery || statusFilter !== "All" ? "Try adjusting your search criteria." : "No contributions have been made yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Supporter</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Campaign</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Credits</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">USD Value</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    key={p._id} 
                    className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-5 px-4 text-xs font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                      {new Date(p.createdAt || new Date()).toLocaleDateString()}
                    </td>
                    <td className="py-5 px-4">
                      <div>
                        <p className="text-sm font-bold text-neutral-800 dark:text-white truncate max-w-[150px]">
                          {p.supporterName || "Unknown"}
                        </p>
                        <p className="text-[10px] text-neutral-500 truncate max-w-[150px]">
                          {p.supporterEmail}
                        </p>
                      </div>
                    </td>
                    <td className="py-5 px-4">
                      <Link 
                        href={`/campaign/${p.campaignId}`}
                        className="text-sm font-bold text-neutral-800 dark:text-white hover:text-emerald-500 transition-colors max-w-[180px] truncate flex items-center gap-1.5"
                      >
                        {p.campaignTitle} <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    </td>
                    <td className="py-5 px-4 text-sm font-black text-emerald-500 whitespace-nowrap">
                      +{p.amount?.toLocaleString()} Cr
                    </td>
                    <td className="py-5 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      ${((p.amount || 0) / 10).toFixed(2)}
                    </td>
                    <td className="py-5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        p.status === "Approved" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        p.status === "Pending" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
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
