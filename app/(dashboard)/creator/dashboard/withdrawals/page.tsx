"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  DollarSign,
  Clock,
  TrendingUp,
  Landmark,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Send,
  Info,
  Ban,
  ArrowRight,
} from "lucide-react";

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "wise", label: "Wise" },
  { value: "payoneer", label: "Payoneer" },
  { value: "mobile_banking", label: "Mobile Banking" },
];

const STATUS_BADGES: Record<string, { bg: string; text: string; icon: any }> = {
  Pending: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", icon: Clock },
  Approved: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  Rejected: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-600 dark:text-red-400", icon: XCircle },
  Cancelled: { bg: "bg-neutral-100 dark:bg-neutral-800", text: "text-neutral-500 dark:text-neutral-400", icon: Ban },
};

export default function WithdrawalsPage() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [credits, setCredits] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");

  const fetchData = async () => {
    if (!session?.user?.email) return;
    try {
      const [balanceRes, historyRes] = await Promise.all([
        fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/balance/${session.user.email}`),
        fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/creator/${session.user.email}`),
      ]);
      const balanceData = await balanceRes.json();
      const historyData = await historyRes.json();
      if (balanceData.success) setBalance(balanceData.data);
      if (historyData.success) setWithdrawals(historyData.data);
    } catch (err) {
      console.error("Failed to fetch withdrawal data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const hasPending = withdrawals.some((w) => w.status === "Pending");
  const numericCredits = Number(credits) || 0;
  const estimatedUSD = numericCredits / 20;

  const validationError = (() => {
    if (!credits) return null;
    if (numericCredits < 200) return "Minimum withdrawal is 200 Credits ($10)";
    if (numericCredits % 20 !== 0) return "Must be a multiple of 20 Credits";
    if (balance && numericCredits > balance.availableCredits) return `Exceeds available balance of ${balance.availableCredits} Cr`;
    return null;
  })();

  const handleSubmit = async () => {
    if (!session?.user?.email || validationError || hasPending) return;
    if (!paymentMethod) { toast.error("Please select a payment method"); return; }
    if (!paymentDetails.trim()) { toast.error("Please enter your payment details"); return; }

    setIsSubmitting(true);
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          withdrawalCredits: numericCredits,
          paymentMethod,
          paymentDetails,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Withdrawal request submitted!");
        setCredits("");
        setPaymentMethod("");
        setPaymentDetails("");
        fetchData();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch (err) {
      toast.error("Network error. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!session?.user?.email) return;
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/api/withdrawals/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Withdrawal cancelled");
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

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
          Withdrawals
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Withdraw your approved campaign earnings
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Available Credits */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" /> Available
            </span>
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Available Credits</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">
            {(balance?.availableCredits || 0).toLocaleString()} <span className="text-sm font-bold text-emerald-500">Cr</span>
          </h3>
        </div>

        {/* Estimated USD */}
        <div className="bg-emerald-500 dark:bg-[#004F3B] rounded-3xl p-6 shadow-lg shadow-emerald-500/20 dark:shadow-[#004F3B]/20 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <p className="text-sm text-emerald-50 font-medium mb-1 relative z-10">Estimated USD</p>
          <h3 className="text-2xl font-black relative z-10">
            ${(balance?.availableUSD || 0).toFixed(2)}
          </h3>
        </div>

        {/* Withdrawn Credits */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Withdrawn Credits</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">
            {(balance?.withdrawnCredits || 0).toLocaleString()} <span className="text-sm font-bold text-blue-500">Cr</span>
          </h3>
        </div>

        {/* Pending Withdrawals */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-sm text-neutral-400 font-medium mb-1">Pending Withdrawals</p>
          <h3 className="text-2xl font-black text-neutral-800 dark:text-white">
            {(balance?.pendingCredits || 0).toLocaleString()} <span className="text-sm font-bold text-amber-500">Cr</span>
          </h3>
        </div>
      </div>

      {/* Main Content: Form + Info */}
      <div className="flex flex-col xl:flex-row gap-8 mb-8">

        {/* Withdrawal Form */}
        <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Request Withdrawal</h3>
          <p className="text-xs text-neutral-400 mb-6">Convert your credits to real money</p>

          {hasPending && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">Pending Request Exists</p>
                <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5">
                  You already have a pending withdrawal. Wait for it to be processed or cancel it before submitting a new one.
                </p>
              </div>
            </div>
          )}

          {/* Credits Input */}
          <div className="mb-5">
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Withdraw Credits
              </label>
              {numericCredits > 0 && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-xs font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md"
                >
                  ≈ ${estimatedUSD.toFixed(2)} USD
                </motion.span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Landmark className="w-4 h-4 text-neutral-400" />
              </div>
              <input
                type="number"
                min={200}
                step={20}
                max={balance?.availableCredits || 0}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                disabled={hasPending}
                placeholder="Min 200 Cr (multiples of 20)"
                className="w-full pl-11 pr-14 py-3.5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-lg font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-xs font-black text-neutral-400">CR</span>
              </div>
            </div>
            {validationError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" /> {validationError}
              </motion.p>
            )}
          </div>

          {/* Payment Method */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={hasPending}
                className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-bold text-neutral-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
              >
                <option value="">Select payment method...</option>
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <CreditCard className="w-4 h-4 text-neutral-400" />
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Payment Details
            </label>
            <textarea
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              disabled={hasPending}
              placeholder="Enter your account number, email, wallet address, etc."
              rows={3}
              className="w-full px-4 py-3.5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 transition-colors text-sm font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Summary */}
          {numericCredits >= 200 && !validationError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl"
            >
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3">
                Withdrawal Summary
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-neutral-600 dark:text-neutral-300">Credits</span>
                  <span className="text-neutral-800 dark:text-white">{numericCredits.toLocaleString()} Cr</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-neutral-600 dark:text-neutral-300">Conversion Rate</span>
                  <span className="text-neutral-800 dark:text-white">20 Cr = $1 USD</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-neutral-600 dark:text-neutral-300">Fee</span>
                  <span className="text-emerald-500">$0.00</span>
                </div>
                <div className="border-t border-emerald-200 dark:border-emerald-500/20 my-2" />
                <div className="flex justify-between text-base font-black">
                  <span className="text-neutral-800 dark:text-white">Net Amount</span>
                  <span className="text-emerald-600 dark:text-emerald-400">${estimatedUSD.toFixed(2)} USD</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={hasPending || isSubmitting || !!validationError || !credits || !paymentMethod || !paymentDetails.trim()}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-emerald-500"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
            ) : (
              <><Send className="w-4 h-4" /> Request Withdrawal</>
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-neutral-800 dark:text-white">How it works</h3>
            </div>
            <div className="space-y-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-emerald-500">1</span>
                </div>
                <p>Enter the amount of credits you'd like to withdraw (min 200, multiples of 20).</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-emerald-500">2</span>
                </div>
                <p>Select your preferred payment method and provide your account details.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-emerald-500">3</span>
                </div>
                <p>Submit your request. An admin will review and approve your withdrawal.</p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-black text-emerald-500">4</span>
                </div>
                <p>Once approved, funds will be sent to your account. You'll receive a notification.</p>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 dark:bg-neutral-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-8 -mt-8 pointer-events-none" />
            <DollarSign className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="text-base font-bold mb-2">Conversion Rate</h3>
            <p className="text-3xl font-black text-emerald-400 mb-1">20 Cr = $1</p>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Credits are converted at a fixed rate. No hidden fees apply.
            </p>
          </div>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">Withdrawal History</h3>
        <p className="text-xs text-neutral-400 mb-6">Track all your past and current withdrawal requests</p>

        {withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <Landmark className="w-10 h-10 text-neutral-300 dark:text-neutral-700 mx-auto mb-3" />
            <p className="text-sm text-neutral-500 font-medium">No withdrawal requests yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800">
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Credits</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">USD</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Method</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Approved</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tx Ref</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => {
                  const badge = STATUS_BADGES[w.status] || STATUS_BADGES.Pending;
                  const BadgeIcon = badge.icon;
                  return (
                    <tr key={w._id} className="border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-4 px-4 text-xs font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                        {new Date(w.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-xs font-black text-neutral-800 dark:text-white whitespace-nowrap">
                        {w.withdrawalCredits.toLocaleString()} Cr
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-emerald-500 whitespace-nowrap">
                        ${w.withdrawalAmountUSD.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-neutral-600 dark:text-neutral-400 whitespace-nowrap capitalize">
                        {w.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          <BadgeIcon className="w-3 h-3" /> {w.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs font-bold text-neutral-500 whitespace-nowrap">
                        {w.approvedAt ? new Date(w.approvedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-neutral-500 whitespace-nowrap max-w-[120px] truncate">
                        {w.transactionReference || "—"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {w.status === "Pending" && (
                          <button
                            onClick={() => handleCancel(w._id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline transition-colors"
                          >
                            Cancel
                          </button>
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
    </div>
  );
}
