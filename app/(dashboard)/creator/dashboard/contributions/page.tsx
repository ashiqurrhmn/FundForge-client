"use client";

import { createPortal } from "react-dom";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Coins,
  MessageSquare,
  AlertCircle,
  HandCoins,
  ArrowLeft,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

interface Contribution {
  _id: string;
  campaignId: string;
  campaignTitle: string;
  supporterEmail: string;
  supporterName: string;
  creatorEmail: string;
  amount: number;
  message: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export default function CreatorContributionsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Confirm dialog state
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    action: "Approved" | "Rejected";
    supporterName: string;
    amount: number;
    campaignTitle: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchContributions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const fetchContributions = async () => {
    setIsLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/creator/${encodeURIComponent(session!.user.email)}`
      );
      const data = await res.json();
      if (data.success) {
        setContributions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch contributions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    contributionId: string,
    status: "Approved" | "Rejected"
  ) => {
    setProcessingId(contributionId);
    setConfirmAction(null);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/${contributionId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();

      if (data.success) {
        toast.success(
          status === "Approved"
            ? "Contribution approved! Campaign funds updated."
            : "Contribution rejected. Credits refunded to supporter."
        );
        fetchContributions();
      } else {
        toast.error(data.message || "Failed to update contribution");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  // Filtering & search
  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.supporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.supporterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        c.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [contributions, searchQuery, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const pending = contributions.filter((c) => c.status === "Pending").length;
    const approved = contributions.filter(
      (c) => c.status === "Approved"
    ).length;
    const rejected = contributions.filter(
      (c) => c.status === "Rejected"
    ).length;
    const totalRaised = contributions
      .filter((c) => c.status === "Approved")
      .reduce((sum, c) => sum + c.amount, 0);
    return { pending, approved, rejected, totalRaised };
  }, [contributions]);

  if (isPending) return <DashboardSkeleton />;
  if (!session) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: Clock,
          color: "text-amber-500",
          bg: "bg-amber-50 dark:bg-amber-500/10",
          border: "border-amber-200 dark:border-amber-500/20",
          badge:
            "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        };
      case "Approved":
        return {
          icon: CheckCircle2,
          color: "text-emerald-500",
          bg: "bg-emerald-50 dark:bg-emerald-500/10",
          border: "border-emerald-200 dark:border-emerald-500/20",
          badge:
            "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        };
      case "Rejected":
        return {
          icon: XCircle,
          color: "text-red-500",
          bg: "bg-red-50 dark:bg-red-500/10",
          border: "border-red-200 dark:border-red-500/20",
          badge:
            "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
        };
      default:
        return {
          icon: Clock,
          color: "text-neutral-500",
          bg: "bg-neutral-50 dark:bg-neutral-800",
          border: "border-neutral-200 dark:border-neutral-700",
          badge: "bg-neutral-100 dark:bg-neutral-800 text-neutral-500",
        };
    }
  };

  return (
    <div className="p-4 md:p-8 w-full">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <Link
          href="/creator/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-emerald-500 dark:hover:text-emerald-400 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
          Contributions
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 font-medium">
          Home / Creator /{" "}
          <span className="text-emerald-500">Contributions</span>
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50 dark:bg-amber-500/10",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle2,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            color: "text-red-500",
            bg: "bg-red-50 dark:bg-red-500/10",
          },
          {
            label: "Total Raised",
            value: `${stats.totalRaised.toLocaleString()} Cr`,
            icon: Coins,
            color: "text-emerald-500",
            bg: "bg-emerald-50 dark:bg-emerald-500/10",
            isHighlight: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl md:rounded-3xl p-4 md:p-5 ${
              stat.isHighlight
                ? "bg-emerald-500 dark:bg-emerald-600 text-white"
                : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
            } shadow-sm`}
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-2 md:mb-3 ${
                stat.isHighlight ? "bg-white/20" : stat.bg
              }`}
            >
              <stat.icon
                className={`w-4 h-4 md:w-5 md:h-5 ${
                  stat.isHighlight ? "text-white" : stat.color
                }`}
              />
            </div>
            <p
              className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-0.5 ${
                stat.isHighlight ? "text-emerald-100" : "text-neutral-400"
              }`}
            >
              {stat.label}
            </p>
            <p
              className={`text-lg md:text-2xl font-black tabular-nums ${
                stat.isHighlight
                  ? "text-white"
                  : "text-neutral-900 dark:text-white"
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl border border-neutral-100 dark:border-neutral-800 p-3 md:p-4 mb-5 md:mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by supporter or campaign..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-neutral-400 shrink-0" />
            <div className="flex gap-1 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-1 flex-wrap">
              {["all", "Pending", "Approved", "Rejected"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === filter
                      ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm"
                      : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {filter === "all" ? "All" : filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contributions List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl border border-neutral-100 dark:border-neutral-800 p-5 md:p-6 animate-pulse"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  <div className="h-3 w-1/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredContributions.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <HandCoins className="w-7 h-7 text-neutral-400" />
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-2">
            {contributions.length === 0
              ? "No contributions yet"
              : "No matching contributions"}
          </h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            {contributions.length === 0
              ? "When supporters contribute to your campaigns, they'll appear here for you to review."
              : "Try adjusting your search or filter to find what you're looking for."}
          </p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          <AnimatePresence>
            {filteredContributions.map((contribution, index) => {
              const config = getStatusConfig(contribution.status);
              const StatusIcon = config.icon;
              const isProcessing = processingId === contribution._id;

              return (
                <motion.div
                  key={contribution._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                  className={`bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl border ${config.border} p-4 md:p-6 hover:shadow-md transition-all`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Supporter avatar */}
                    <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 md:w-11 md:h-11 rounded-full ${config.bg} flex items-center justify-center shrink-0`}
                      >
                        <User
                          className={`w-4 h-4 md:w-5 md:h-5 ${config.color}`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Name & amount row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                            {contribution.supporterName}
                          </h4>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}
                          >
                            {contribution.status}
                          </span>
                        </div>

                        {/* Email */}
                        <p className="text-xs text-neutral-400 font-medium truncate mb-2">
                          {contribution.supporterEmail}
                        </p>

                        {/* Campaign & Amount */}
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs">
                          <span className="flex items-center gap-1.5 font-semibold text-neutral-500 dark:text-neutral-400">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            {contribution.campaignTitle}
                          </span>
                          <span className="flex items-center gap-1.5 font-black text-emerald-500">
                            <Coins className="w-3 h-3" />
                            {contribution.amount.toLocaleString()} Cr
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-neutral-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              contribution.createdAt
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        {/* Message */}
                        {contribution.message && (
                          <div className="mt-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic">
                              &quot;{contribution.message}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {contribution.status === "Pending" && (
                      <div className="flex gap-2 shrink-0 self-start md:self-center">
                        <button
                          onClick={() =>
                            setConfirmAction({
                              id: contribution._id,
                              action: "Approved",
                              supporterName: contribution.supporterName,
                              amount: contribution.amount,
                              campaignTitle: contribution.campaignTitle,
                            })
                          }
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            setConfirmAction({
                              id: contribution._id,
                              action: "Rejected",
                              supporterName: contribution.supporterName,
                              amount: contribution.amount,
                              campaignTitle: contribution.campaignTitle,
                            })
                          }
                          disabled={isProcessing}
                          className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-500/10 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    )}

                    {/* Resolved status indicator */}
                    {contribution.status !== "Pending" && (
                      <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center">
                        <StatusIcon
                          className={`w-4 h-4 ${config.color}`}
                        />
                        <span
                          className={`text-xs font-bold ${config.color}`}
                        >
                          {contribution.status}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Confirm Action Modal */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {confirmAction && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              <div
                className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div
                  className={`px-6 py-5 ${
                    confirmAction.action === "Approved"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                      : "bg-gradient-to-br from-red-500 to-rose-600"
                  } text-white`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {confirmAction.action === "Approved" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <h3 className="text-lg font-black">
                      {confirmAction.action === "Approved"
                        ? "Approve Contribution"
                        : "Reject Contribution"}
                    </h3>
                  </div>
                  <p className="text-sm text-white/70">
                    This action cannot be undone.
                  </p>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 font-medium">
                        Supporter
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {confirmAction.supporterName}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 font-medium">
                        Amount
                      </span>
                      <span className="font-black text-emerald-500">
                        {confirmAction.amount.toLocaleString()} Cr
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-500 font-medium">
                        Campaign
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white text-right max-w-[200px] truncate">
                        {confirmAction.campaignTitle}
                      </span>
                    </div>
                  </div>

                  {confirmAction.action === "Approved" ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-xl mb-5">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium leading-relaxed">
                        <strong>Approving</strong> will add{" "}
                        {confirmAction.amount.toLocaleString()} Cr to your
                        campaign&apos;s raised total and count the supporter
                        as a backer.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-xl mb-5">
                      <p className="text-xs text-red-700 dark:text-red-400 font-medium leading-relaxed">
                        <strong>Rejecting</strong> will refund{" "}
                        {confirmAction.amount.toLocaleString()} Cr back to
                        the supporter&apos;s account.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="flex-1 py-3 px-4 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          confirmAction.id,
                          confirmAction.action
                        )
                      }
                      className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold text-white transition-all shadow-lg flex items-center justify-center gap-2 ${
                        confirmAction.action === "Approved"
                          ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                          : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                      }`}
                    >
                      {confirmAction.action === "Approved"
                        ? "Yes, Approve"
                        : "Yes, Reject"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
}
