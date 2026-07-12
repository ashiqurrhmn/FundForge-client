"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import type { PaymentRecord } from "@/app/lib/types";
import {
  ReceiptText,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentHistoryPage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.push("/login");
    }
  }, [isSessionPending, session, router]);

  // Fetch payments when session is available
  useEffect(() => {
    const fetchPayments = async () => {
      if (!session?.user?.email) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments/${encodeURIComponent(
            session.user.email
          )}`
        );
        const data = await response.json();

        if (data.success) {
          setPayments(data.data);
        } else {
          setError(data.message || "Failed to fetch payment history");
          toast.error("Failed to load payment history");
        }
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Network error. Please try again.");
        toast.error("Network error loading payments");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchPayments();
    }
  }, [session?.user?.email]);

  // Filter payments by search query
  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      succeeded:
        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
      pending:
        "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400",
      failed: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
          styles[status] || styles.pending
        }`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isSessionPending) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="p-6 md:p-8 w-full">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
            Payment History
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            Home /{" "}
            <span className="text-emerald-500">Payment History</span>
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by ID or package..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all w-full sm:w-64"
          />
        </div>
      </div>

      {/* Stats Summary */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
            <p className="text-sm text-neutral-400 font-medium mb-1">
              Total Spent
            </p>
            <p className="text-2xl font-black text-neutral-800 dark:text-white">
              $
              {payments
                .filter((p) => p.status === "succeeded")
                .reduce((sum, p) => sum + p.amountPaid, 0)
                .toFixed(2)}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
            <p className="text-sm text-neutral-400 font-medium mb-1">
              Credits Purchased
            </p>
            <p className="text-2xl font-black text-emerald-500">
              {payments
                .filter((p) => p.status === "succeeded")
                .reduce((sum, p) => sum + p.creditsPurchased, 0)
                .toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
            <p className="text-sm text-neutral-400 font-medium mb-1">
              Transactions
            </p>
            <p className="text-2xl font-black text-neutral-800 dark:text-white">
              {payments.length}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
            <p className="text-sm font-medium text-neutral-500">
              Loading payment history...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <XCircle className="w-10 h-10 text-red-400 mb-3" />
            <p className="text-sm font-medium text-neutral-500">{error}</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center mb-4">
              <ReceiptText className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
            </div>
            <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-2">
              {searchQuery ? "No matching payments" : "No payments yet"}
            </h3>
            <p className="text-sm text-neutral-400 text-center max-w-xs">
              {searchQuery
                ? "Try a different search term."
                : "Purchase credits to see your transaction history here."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-800">
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Transaction ID
                    </th>
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Package
                    </th>
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Credits
                    </th>
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Amount
                    </th>
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Date
                    </th>
                    <th className="text-left text-xs font-bold text-neutral-400 uppercase tracking-wider px-6 py-4">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment, index) => (
                    <tr
                      key={payment.transactionId}
                      className={`border-b border-neutral-50 dark:border-neutral-800/50 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors ${
                        index === filteredPayments.length - 1
                          ? "border-b-0"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                          {payment.transactionId.slice(0, 20)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-bold text-neutral-800 dark:text-white">
                            {payment.packageName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          +{payment.creditsPurchased.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-neutral-800 dark:text-white">
                          ${payment.amountPaid.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-neutral-500">
                          {new Date(payment.paymentDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 p-4">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.transactionId}
                  className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-bold text-neutral-800 dark:text-white">
                        {payment.packageName}
                      </span>
                    </div>
                    {getStatusBadge(payment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">
                        Credits
                      </p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        +{payment.creditsPurchased.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-neutral-400 uppercase tracking-wider mb-0.5">
                        Amount
                      </p>
                      <p className="text-sm font-bold text-neutral-800 dark:text-white">
                        ${payment.amountPaid.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                    <span className="font-mono">
                      {payment.transactionId.slice(0, 16)}...
                    </span>
                    <span>
                      {new Date(payment.paymentDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
