"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { useTheme } from "next-themes";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/lib/stripe";
import { CheckoutForm } from "@/components/dashboard/checkout-form";
import { CREDIT_PACKAGES, type CreditPackage } from "@/app/lib/types";
import {
  Zap,
  Sparkles,
  Rocket,
  Crown,
  Check,
  Loader2,
  Lock,
  ArrowLeft,
  CreditCard,
  Coins,
  Star,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const PACKAGE_CONFIG = [
  {
    icon: Zap,
    gradient: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    ring: "ring-blue-500/30",
    accent: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  {
    icon: Sparkles,
    gradient: "from-violet-500 to-purple-600",
    glow: "shadow-violet-500/20",
    ring: "ring-violet-500/30",
    accent: "text-violet-500",
    bg: "bg-violet-50 dark:bg-violet-500/10",
  },
  {
    icon: Rocket,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/30",
    accent: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  {
    icon: Crown,
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/20",
    ring: "ring-amber-500/30",
    accent: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
];

export default function PurchaseCreditsPage() {
  const { data: session, isPending } = useSession();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [customCredits, setCustomCredits] = useState<string>("");
  const [step, setStep] = useState<"select" | "pay">("select");

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  const handleSelectPackage = async (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setClientSecret(null);
    setIsCreatingIntent(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: pkg.price,
            credits: pkg.credits,
            packageName: pkg.label,
          }),
        }
      );
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message || "Failed to initialize payment");
        setSelectedPackage(null);
        return;
      }
      setClientSecret(data.clientSecret);
      setStep("pay");
    } catch {
      toast.error("Network error. Please try again.");
      setSelectedPackage(null);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleBack = () => {
    setSelectedPackage(null);
    setClientSecret(null);
    setCustomCredits("");
    setStep("select");
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!session) return null;

  const userEmail = session.user?.email || "";
  const customPrice = customCredits && parseInt(customCredits) >= 50
    ? Math.max(5, Math.ceil(parseInt(customCredits) * 0.1))
    : null;

  return (
    <div className="p-4 md:p-8 w-full">
      <Toaster position="top-center" />

      {/* ── Page Header ── */}
      <div className="mb-5 md:mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
          {step === "pay" ? "Complete Purchase" : "Purchase Credits"}
        </h1>
        <p className="text-xs md:text-sm text-neutral-400 font-medium">
          Home /{" "}
          {step === "pay" ? (
            <>
              <button onClick={handleBack} className="hover:text-emerald-500 transition-colors">
                Purchase Credits
              </button>{" "}
              / <span className="text-emerald-500">Checkout</span>
            </>
          ) : (
            <span className="text-emerald-500">Purchase Credits</span>
          )}
        </p>
      </div>

      {/* ── STEP 1: SELECT PACKAGE ── */}
      {step === "select" && (
        <div className="space-y-5">

          {/* Credit packages grid — 2 cols on mobile, 4 on xl */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
            {CREDIT_PACKAGES.map((pkg, i) => {
              const cfg = PACKAGE_CONFIG[i];
              const Icon = cfg.icon;
              const perCredit = (pkg.price / pkg.credits).toFixed(3);
              const isLoading = isCreatingIntent && selectedPackage?.id === pkg.id;

              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  disabled={isCreatingIntent}
                  className={`group relative flex flex-col text-left rounded-2xl md:rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 hover:border-transparent hover:shadow-2xl ${cfg.glow} transition-all duration-300 disabled:opacity-60 disabled:cursor-wait`}
                >
                  {/* Gradient top strip */}
                  <div className={`h-1 md:h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    {/* Badge */}
                    {pkg.badge && (
                      <span className={`self-start inline-flex items-center gap-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 rounded-full mb-2 md:mb-3 bg-gradient-to-r ${cfg.gradient} text-white shadow-sm`}>
                        <Star className="w-1.5 h-1.5 md:w-2 md:h-2 fill-white" />
                        {pkg.badge}
                      </span>
                    )}
                    {!pkg.badge && <div className="mb-2 md:mb-3 h-4 md:h-5" />}

                    {/* Icon */}
                    <div className={`w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl ${cfg.bg} flex items-center justify-center mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${cfg.accent}`} />
                    </div>

                    {/* Label */}
                    <p className="text-[9px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5 md:mb-1">
                      {pkg.label}
                    </p>

                    {/* Credits */}
                    <div className="flex items-baseline gap-0.5 md:gap-1 mb-0.5">
                      <span className="text-xl md:text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
                        {pkg.credits >= 1000 ? `${pkg.credits / 1000}K` : pkg.credits}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-neutral-400">CR</span>
                    </div>

                    {/* Per-credit value */}
                    <p className="text-[10px] md:text-[11px] font-medium text-neutral-400 mb-3 md:mb-4">
                      ${perCredit}/cr
                    </p>

                    {/* Divider */}
                    <div className="border-t border-neutral-100 dark:border-neutral-800 mb-2 md:mb-4 mt-auto" />

                    {/* Price + CTA row */}
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-lg font-black text-neutral-900 dark:text-white">
                        ${pkg.price}
                      </span>
                      {/* On mobile: always visible small badge; on desktop: hover reveal */}
                      <div className={`flex items-center gap-1 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white bg-gradient-to-r ${cfg.gradient} shadow-sm md:shadow-md md:opacity-0 md:group-hover:opacity-100 md:translate-x-2 md:group-hover:translate-x-0 transition-all duration-300`}>
                        {isLoading ? (
                          <Loader2 className="w-2.5 h-2.5 md:w-3 md:h-3 animate-spin" />
                        ) : (
                          <Check className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        )}
                        {isLoading ? "..." : "Buy"}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom amount section */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl md:rounded-3xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
            <div className="flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Coins className="w-3.5 h-3.5 md:w-4 md:h-4 text-neutral-500" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-bold text-neutral-900 dark:text-white">Custom Amount</h3>
                <p className="text-[10px] md:text-xs text-neutral-400 font-medium">Min 50 credits · $0.10/credit</p>
              </div>
            </div>

            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-3">
                {/* Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <span className="text-xs font-black text-neutral-400">CR</span>
                  </div>
                  <input
                    type="number"
                    min="50"
                    placeholder="Enter amount..."
                    value={customCredits}
                    onChange={(e) => setCustomCredits(e.target.value)}
                    disabled={isCreatingIntent}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-colors text-base font-bold text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
                  />
                </div>

                {/* Price + button row */}
                <div className="flex items-center gap-3">
                  {customPrice && (
                    <div className="flex flex-col items-start">
                      <span className="text-xl font-black text-emerald-500">${customPrice}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      const credits = parseInt(customCredits);
                      if (isNaN(credits) || credits < 50) {
                        toast.error("Minimum 50 credits required");
                        return;
                      }
                      handleSelectPackage({
                        id: "custom",
                        credits,
                        price: Math.max(5, Math.ceil(credits * 0.1)),
                        label: "Custom",
                      });
                    }}
                    disabled={isCreatingIntent || !customCredits || parseInt(customCredits) < 50}
                    className="flex-1 h-11 px-6 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold text-sm hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap"
                  >
                    {isCreatingIntent && selectedPackage?.id === "custom" ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                    ) : (
                      "Proceed →"
                    )}
                  </button>
                </div>
              </div>

              {/* Perks row */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                {["Instant delivery", "No expiry", "Secured by Stripe", "24/7 support"].map((item) => (
                  <span key={item} className="flex items-center gap-1 text-[10px] md:text-xs font-semibold text-neutral-400">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: PAYMENT ── */}
      {step === "pay" && (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-5">

          {/* LEFT: Order Summary — horizontal compact banner on mobile, vertical card on desktop */}
          <div className="lg:col-span-2 space-y-4">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to packages
            </button>

            {/* Selected package — full card on desktop, horizontal strip on mobile */}
            {selectedPackage && (() => {
              const idx = CREDIT_PACKAGES.findIndex(p => p.id === selectedPackage.id);
              const cfg = idx >= 0 ? PACKAGE_CONFIG[idx] : PACKAGE_CONFIG[0];
              const Icon = cfg.icon;
              return (
                <>
                  {/* Mobile: compact horizontal strip */}
                  <div className={`lg:hidden relative rounded-2xl overflow-hidden bg-gradient-to-r ${cfg.gradient} text-white p-4 shadow-lg ${cfg.glow}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{selectedPackage.label} Package</p>
                          <p className="text-lg font-black">
                            {selectedPackage.credits >= 1000 ? `${selectedPackage.credits / 1000}K` : selectedPackage.credits} Credits
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white/60 text-[10px] font-bold">Total</p>
                        <p className="text-2xl font-black">${selectedPackage.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop: vertical card */}
                  <div className={`hidden lg:block relative rounded-2xl overflow-hidden bg-gradient-to-br ${cfg.gradient} text-white p-5 shadow-xl ${cfg.glow}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full -ml-5 -mb-5" />
                    <div className="relative z-10">
                      <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-0.5">
                        {selectedPackage.label} Package
                      </p>
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-3xl font-black">
                          {selectedPackage.credits >= 1000 ? `${selectedPackage.credits / 1000}K` : selectedPackage.credits}
                        </span>
                        <span className="text-white/60 font-bold text-sm">Credits</span>
                      </div>
                      <div className="border-t border-white/20 pt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 font-medium text-xs">Total due today</span>
                          <span className="text-2xl font-black">${selectedPackage.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Trust badges — horizontal on mobile, vertical on desktop */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-3 md:p-4">
              <div className="flex flex-row lg:flex-col gap-3 lg:gap-3 flex-wrap">
                {[
                  { icon: Lock, label: "256-bit SSL" },
                  { icon: CreditCard, label: "Powered by Stripe" },
                  { icon: Check, label: "Credits instantly" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500" />
                    </div>
                    <span className="text-[11px] md:text-xs font-semibold text-neutral-600 dark:text-neutral-400">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Form */}
          <div className="lg:col-span-3">
            {isCreatingIntent ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[420px] bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-8">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
                <p className="text-base font-bold text-neutral-900 dark:text-white mb-1">Setting up secure payment</p>
                <p className="text-sm text-neutral-400 text-center">Establishing encrypted connection…</p>
              </div>
            ) : clientSecret && selectedPackage ? (
              <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-900 dark:text-white">Payment Details</h2>
                    <p className="text-[11px] text-neutral-400 font-medium">Your card info is never stored on our servers</p>
                  </div>
                </div>

                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: isDark
                      ? {
                          theme: "night" as const,
                          variables: {
                            colorPrimary: "#10b981",
                            colorBackground: "#171717",
                            colorText: "#f5f5f5",
                            colorTextSecondary: "#a3a3a3",
                            colorTextPlaceholder: "#525252",
                            borderRadius: "10px",
                            fontFamily: "inherit",
                            spacingUnit: "3px",
                            fontSizeBase: "13px",
                          },
                          rules: {
                            ".Input": {
                              backgroundColor: "#262626",
                              border: "2px solid #404040",
                              boxShadow: "none",
                              padding: "10px 12px",
                              color: "#f5f5f5",
                            },
                            ".Input:focus": {
                              border: "2px solid #10b981",
                              boxShadow: "0 0 0 3px rgba(16,185,129,0.15)",
                            },
                            ".Label": {
                              color: "#a3a3a3",
                              fontWeight: "600",
                              marginBottom: "6px",
                            },
                            ".Tab": {
                              backgroundColor: "#262626",
                              border: "2px solid #404040",
                              color: "#a3a3a3",
                            },
                            ".Tab:hover": {
                              backgroundColor: "#303030",
                              color: "#f5f5f5",
                            },
                            ".Tab--selected": {
                              backgroundColor: "#1a1a1a",
                              border: "2px solid #10b981",
                              color: "#f5f5f5",
                            },
                            ".Block": {
                              backgroundColor: "#1f1f1f",
                              border: "1px solid #333333",
                            },
                          },
                        }
                      : {
                          theme: "stripe" as const,
                          variables: {
                            colorPrimary: "#10b981",
                            borderRadius: "10px",
                            fontFamily: "inherit",
                            spacingUnit: "3px",
                            fontSizeBase: "13px",
                          },
                          rules: {
                            ".Input": {
                              border: "2px solid #f5f5f5",
                              boxShadow: "none",
                              padding: "10px 12px",
                            },
                            ".Input:focus": {
                              border: "2px solid #10b981",
                              boxShadow: "0 0 0 3px rgba(16,185,129,0.1)",
                            },
                            ".Label": {
                              fontWeight: "600",
                              marginBottom: "6px",
                            },
                          },
                        },
                  }}
                >
                  <CheckoutForm
                    packageName={selectedPackage.label}
                    credits={selectedPackage.credits}
                    amount={selectedPackage.price}
                    userEmail={userEmail}
                    onCancel={handleBack}
                  />
                </Elements>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
