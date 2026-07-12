"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth-client";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Search,
  DollarSign,
  Users,
  AlertTriangle,
  Ban,
  Eye,
  X,
} from "lucide-react";

const STATUS_BADGES: Record<string, { bg: string; text: string; icon: any }> = {
  Pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  Approved: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  Rejected: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: XCircle },
  Cancelled: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-500 dark:text-neutral-400", icon: Ban },
};

export default function AdminWithdrawalsPage() {
  const { data: session } = useSession();
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [actionModal, setActionModal] = useState<{ type: "approve" | "reject"; withdrawal: any } | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/admin`);
      const data = await res.json();
      if (data.success) setWithdrawals(data.data);
    } catch (err) {
      console.error("Failed to fetch withdrawals", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleAction = async () => {
    if (!actionModal) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/${actionModal.withdrawal._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: actionModal.type === "approve" ? "Approved" : "Rejected",
          adminNote,
          transactionReference: transactionRef,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Withdrawal ${actionModal.type === "approve" ? "approved" : "rejected"} successfully`);
        setActionModal(null);
        setTransactionRef("");
        setAdminNote("");
        fetchWithdrawals();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter((w) => {
    const matchesFilter = filter === "All" || w.status === filter;
    const matchesSearch = !searchQuery || 
      w.creatorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.creatorEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats
  const totalPending = withdrawals.filter((w) => w.status === "Pending").length;
  const totalApprovedUSD = withdrawals
    .filter((w) => w.status === "Approved")
    .reduce((acc, w) => acc + (w.withdrawalAmountUSD || 0), 0);
  const totalPendingUSD = withdrawals
    .filter((w) => w.status === "Pending")
    .reduce((acc, w) => acc + (w.withdrawalAmountUSD || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 w-full">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
          Withdrawal Requests
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Review and manage creator withdrawal requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Pending Requests</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{totalPending}</h3>
          <p className="text-xs text-amber-500 font-bold mt-1">${totalPendingUSD.toFixed(2)} USD</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Total Approved</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">${totalApprovedUSD.toFixed(2)}</h3>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Total Requests</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">{withdrawals.length}</h3>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["All", "Pending", "Approved", "Rejected", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === status
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search creator..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        {filteredWithdrawals.length === 0 ? (
          <div className="text-center py-12">
            <Landmark className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 font-medium">No withdrawal requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Creator</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Credits</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">USD</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Method</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Details</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.map((w) => {
                  const badge = STATUS_BADGES[w.status] || STATUS_BADGES.Pending;
                  const BadgeIcon = badge.icon;
                  return (
                    <tr key={w._id} className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-bold text-neutral-800 dark:text-white">{w.creatorName}</p>
                          <p className="text-[10px] text-neutral-400 font-medium">{w.creatorEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-black text-neutral-800 dark:text-white whitespace-nowrap">
                        {w.withdrawalCredits.toLocaleString()} Cr
                      </td>
                      <td className="py-4 px-4 text-sm font-bold text-emerald-500 whitespace-nowrap">
                        ${w.withdrawalAmountUSD.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap capitalize">
                        {w.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="py-4 px-4 text-xs text-neutral-500 max-w-[150px] truncate" title={w.paymentDetails}>
                        {w.paymentDetails}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {new Date(w.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          <BadgeIcon className="w-3 h-3" /> {w.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {w.status === "Pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => { setActionModal({ type: "approve", withdrawal: w }); setTransactionRef(""); setAdminNote(""); }}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => { setActionModal({ type: "reject", withdrawal: w }); setTransactionRef(""); setAdminNote(""); }}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Modal */}
      <AnimatePresence>
        {actionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActionModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className={`px-6 py-5 text-white ${actionModal.type === "approve" ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
                  <button
                    type="button"
                    onClick={() => setActionModal(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-20 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h2 className="text-lg font-black">
                    {actionModal.type === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
                  </h2>
                  <p className="text-sm opacity-80 mt-1">
                    {actionModal.withdrawal.creatorName} — {actionModal.withdrawal.withdrawalCredits.toLocaleString()} Cr (${actionModal.withdrawal.withdrawalAmountUSD.toFixed(2)})
                  </p>
                </div>

                {/* Body */}
                <div className="p-6">
                  {actionModal.type === "approve" && (
                    <div className="mb-5">
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                        Transaction Reference (Optional)
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g., TXN-2026-07-12-001"
                        className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-bold text-neutral-900 dark:text-white"
                      />
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                      {actionModal.type === "approve" ? "Admin Note (Optional)" : "Rejection Reason"}
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder={actionModal.type === "approve" ? "Any notes..." : "Provide a reason for rejection..."}
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActionModal(null)}
                      className="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-2xl font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAction}
                      disabled={isProcessing || (actionModal.type === "reject" && !adminNote.trim())}
                      className={`flex-1 py-3 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        actionModal.type === "approve"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : actionModal.type === "approve" ? (
                        <><CheckCircle2 className="w-4 h-4" /> Approve</>
                      ) : (
                        <><XCircle className="w-4 h-4" /> Reject</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
