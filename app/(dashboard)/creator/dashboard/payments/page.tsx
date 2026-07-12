"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth-client";
import { Loader2, ReceiptText, Clock, CheckCircle2, XCircle, Ban, Search } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_BADGES: Record<string, { bg: string; text: string; icon: any }> = {
  Pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  Approved: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  Rejected: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: XCircle },
  Cancelled: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-500 dark:text-neutral-400", icon: Ban },
};

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session?.user?.email) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/creator/${session.user.email}`);
          const data = await res.json();
          if (data.success) {
            setWithdrawals(data.data);
          }
        } catch (err) {
          console.error("Failed to fetch payment history", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHistory();
    }
  }, [session]);

  const filteredWithdrawals = withdrawals.filter(w => 
    !searchQuery || 
    w.transactionReference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.paymentMethod?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.status?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
            Payment History
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            View all your past and current withdrawal requests
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by status, method, or tx ref..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        {filteredWithdrawals.length === 0 ? (
          <div className="text-center py-16">
            <ReceiptText className="w-12 h-12 text-neutral-200 dark:text-neutral-800 mx-auto mb-4" />
            <h3 className="text-base font-bold text-neutral-800 dark:text-white mb-1">No payment history found</h3>
            <p className="text-sm text-neutral-500">
              {searchQuery ? "Try adjusting your search criteria." : "You haven't requested any withdrawals yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Request Date</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Credits</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">USD Amount</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Payment Method</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Approved Date</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Transaction Ref</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((w, index) => {
                  const badge = STATUS_BADGES[w.status] || STATUS_BADGES.Pending;
                  const BadgeIcon = badge.icon;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={w._id} 
                      className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-5 px-4 text-sm font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                        {new Date(w.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-4 text-sm font-black text-neutral-800 dark:text-white whitespace-nowrap">
                        {w.withdrawalCredits.toLocaleString()} Cr
                      </td>
                      <td className="py-5 px-4 text-sm font-bold text-emerald-500 whitespace-nowrap">
                        ${w.withdrawalAmountUSD.toFixed(2)}
                      </td>
                      <td className="py-5 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap capitalize">
                        {w.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="py-5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          <BadgeIcon className="w-3.5 h-3.5" /> {w.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-xs font-bold text-neutral-500 whitespace-nowrap">
                        {w.approvedAt ? new Date(w.approvedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-5 px-4 text-xs font-medium text-neutral-500 whitespace-nowrap max-w-[150px] truncate">
                        {w.transactionReference ? (
                          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-[10px] font-bold tracking-wider">
                            {w.transactionReference}
                          </span>
                        ) : "—"}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
