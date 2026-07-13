"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { fetchWithAuth } from "@/app/lib/fetchWithAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Coins,
  Wallet,
  MessageSquare,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

interface Campaign {
  _id: string;
  campaign_title: string;
  funding_goal: number;
  minimum_contribution?: number;
  raisedCredits?: number;
  creator_email: string;
  creator_name: string;
  deadline: string;
}

interface ContributeDialogProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ContributeDialog({
  campaign,
  isOpen,
  onClose,
  onSuccess,
}: ContributeDialogProps) {
  const { data: session, isPending: isSessionPending } = useSession();
  const router = useRouter();

  const [userCredits, setUserCredits] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [amount, setAmount] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const minContribution = campaign.minimum_contribution || 1;
  const raisedCredits = campaign.raisedCredits || 0;
  const remaining = campaign.funding_goal - raisedCredits;

  // Fetch user data when dialog opens
  const fetchUserData = useCallback(async () => {
    if (!session?.user?.email) return;
    setIsLoadingUser(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${encodeURIComponent(session.user.email)}`
      );
      const json = await res.json();
      if (json.success) {
        setUserCredits(json.data.credits);
        setUserRole(json.data.role);
      }
    } catch {
      // fallback to session data
      setUserCredits((session.user as any)?.credits || 0);
      setUserRole((session.user as any)?.role || "supporter");
    } finally {
      setIsLoadingUser(false);
    }
  }, [session]);

  useEffect(() => {
    if (isOpen && session) {
      fetchUserData();
      setAmount("");
      setMessage("");
      setError("");
      setIsSuccess(false);
    }
  }, [isOpen, session, fetchUserData]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isOpen && !isSessionPending && !session) {
      onClose();
      router.push("/login");
    }
  }, [isOpen, isSessionPending, session, router, onClose]);

  const numericAmount = Number(amount) || 0;
  const isSupporterRole = userRole === "supporter";

  // Validate contribution amount
  const getValidationError = (): string => {
    if (!amount || numericAmount === 0) return "";
    if (numericAmount < 0) return "Amount cannot be negative";
    if (numericAmount < minContribution)
      return `Minimum contribution is ${minContribution.toLocaleString()} Cr`;
    if (numericAmount > userCredits)
      return `Insufficient credits. You have ${userCredits.toLocaleString()} Cr`;
    if (numericAmount > remaining)
      return `Cannot exceed remaining goal of ${remaining.toLocaleString()} Cr`;
    if (!Number.isInteger(numericAmount))
      return "Amount must be a whole number";
    return "";
  };

  const validationError = getValidationError();
  const isValid =
    isSupporterRole &&
    numericAmount > 0 &&
    numericAmount >= minContribution &&
    numericAmount <= userCredits &&
    numericAmount <= remaining &&
    Number.isInteger(numericAmount) &&
    !validationError;

  const handleSubmit = async () => {
    if (!isValid || !session?.user) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contributions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: campaign._id,
            campaignTitle: campaign.campaign_title,
            supporterEmail: session.user.email,
            supporterName: session.user.name,
            creatorEmail: campaign.creator_email,
            amount: numericAmount,
            message: message.trim(),
          }),
        }
      );

      const json = await res.json();

      if (!json.success) {
        setError(json.message || "Failed to submit contribution");
        return;
      }

      setIsSuccess(true);
      toast.success("Contribution submitted! Awaiting creator approval.");

      // Wait a moment to show success state, then close
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Success State ── */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        delay: 0.2,
                        damping: 10,
                        stiffness: 200,
                      }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white mb-2">
                    Contribution Submitted!
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
                    Your contribution of{" "}
                    <span className="font-bold text-emerald-500">
                      {numericAmount.toLocaleString()} Cr
                    </span>{" "}
                    is pending creator approval.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-neutral-400 font-medium">
                    <Shield className="w-3 h-3" /> Credits are held until
                    approved
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* ── Header ── */}
                  <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 px-6 py-5 text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/5 rounded-full -ml-5 -mb-5 pointer-events-none" />

                    <button
                      type="button"
                      onClick={onClose}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-20 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-200" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                          Support Campaign
                        </span>
                      </div>
                      <h2 className="text-lg font-black leading-tight line-clamp-2">
                        {campaign.campaign_title}
                      </h2>
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="p-6">
                    {/* Not supporter warning */}
                    {!isLoadingUser && !isSupporterRole && session && (
                      <div className="mb-5 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-amber-700 dark:text-amber-400">
                            Only Supporters can contribute
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5">
                            Your current role is &quot;{userRole}&quot;.
                            Contributions are only available for Supporter
                            accounts.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Loading state */}
                    {isLoadingUser ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                        <p className="text-sm text-neutral-400 font-medium">
                          Loading your account...
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Credit & Min info tiles */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                                <Wallet className="w-3.5 h-3.5 text-blue-500" />
                              </div>
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                Your Credits
                              </span>
                            </div>
                            <p className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                              {userCredits.toLocaleString()}{" "}
                              <span className="text-xs font-bold text-emerald-500">
                                Cr
                              </span>
                            </p>
                          </div>

                          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                              </div>
                              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                Minimum
                              </span>
                            </div>
                            <p className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                              {minContribution.toLocaleString()}{" "}
                              <span className="text-xs font-bold text-emerald-500">
                                Cr
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Amount Input */}
                        <div className="mb-4">
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                            Contribution Amount
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                              <Coins className="w-4 h-4 text-neutral-400" />
                            </div>
                            <input
                              type="number"
                              min={minContribution}
                              max={Math.min(userCredits, remaining)}
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                setError("");
                              }}
                              disabled={!isSupporterRole || isSubmitting}
                              placeholder={`Min ${minContribution} Cr`}
                              className="w-full pl-11 pr-14 py-3.5 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors text-lg font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                              <span className="text-xs font-black text-neutral-400">
                                CR
                              </span>
                            </div>
                          </div>

                          {/* Validation error */}
                          {validationError && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1.5"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {validationError}
                            </motion.p>
                          )}
                        </div>

                        {/* Message textarea */}
                        <div className="mb-5">
                          <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
                            <MessageSquare className="w-3 h-3 inline mr-1" />
                            Message to Creator{" "}
                            <span className="text-neutral-300 dark:text-neutral-600 font-medium normal-case">
                              (optional)
                            </span>
                          </label>
                          <textarea
                            rows={2}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={!isSupporterRole || isSubmitting}
                            placeholder="Leave an encouraging message..."
                            className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>

                        {/* Contribution Summary */}
                        {numericAmount > 0 && !validationError && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-2xl"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                Contribution Summary
                              </span>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                                  Contributing
                                </span>
                                <span className="font-bold text-neutral-900 dark:text-white">
                                  {numericAmount.toLocaleString()} Cr
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                                  Remaining Balance
                                </span>
                                <span className="font-bold text-neutral-900 dark:text-white">
                                  {(
                                    userCredits - numericAmount
                                  ).toLocaleString()}{" "}
                                  Cr
                                </span>
                              </div>
                              <div className="border-t border-emerald-200/50 dark:border-emerald-500/10 pt-2 mt-2">
                                <div className="flex justify-between">
                                  <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                                    Status
                                  </span>
                                  <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                    Pending Approval
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Server error */}
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400">
                              {error}
                            </p>
                          </motion.div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-3.5 px-4 rounded-2xl border-2 border-neutral-100 dark:border-neutral-800 text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSubmit}
                            disabled={!isValid || isSubmitting}
                            className="flex-[2] py-3.5 px-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 dark:disabled:hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing…
                              </>
                            ) : (
                              <>
                                Confirm Contribution
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>

                        {/* Trust note */}
                        <p className="text-center text-[11px] text-neutral-400 font-medium mt-3 flex items-center justify-center gap-1.5">
                          <Shield className="w-3 h-3" /> Credits held until
                          creator approves
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
