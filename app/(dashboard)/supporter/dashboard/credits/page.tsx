"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/app/lib/stripe";
import { CheckoutForm } from "@/components/dashboard/checkout-form";
import { CREDIT_PACKAGES, type CreditPackage } from "@/app/lib/types";
import {
  CreditCard,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Loader2,
  ArrowLeft,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Icon mapping for each package
const PACKAGE_ICONS = [Zap, Sparkles, Rocket, Crown];

export default function PurchaseCreditsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

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
    } catch (error) {
      console.error("Payment intent error:", error);
      toast.error("Network error. Please try again.");
      setSelectedPackage(null);
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handleCancelCheckout = () => {
    setSelectedPackage(null);
    setClientSecret(null);
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

  return (
    <div className="p-6 md:p-8 w-full">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-white mb-1">
          Purchase Credits
        </h1>
        <p className="text-sm text-neutral-400 font-medium">
          Home / <span className="text-emerald-500">Purchase Credits</span>
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-[#004F3B] dark:to-[#003D2E] rounded-3xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -ml-8 -mb-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">Platform Credits</h2>
          </div>
          <p className="text-emerald-50 text-sm max-w-lg leading-relaxed">
            Credits are used to support campaigns on FundForge. Purchase a
            package below and start making an impact today. Larger packages offer
            better value per credit.
          </p>
        </div>
      </div>

      {/* Package Cards + Checkout Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Package Selection */}
        <div>
          <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-5">
            {selectedPackage ? (
              <button
                onClick={handleCancelCheckout}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-emerald-500 transition-colors mb-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to packages
              </button>
            ) : null}
            Choose a Package
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CREDIT_PACKAGES.map((pkg, index) => {
              const Icon = PACKAGE_ICONS[index];
              const isSelected = selectedPackage?.id === pkg.id;
              const perCredit = (pkg.price / pkg.credits).toFixed(2);

              return (
                <button
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  disabled={isCreatingIntent}
                  className={`relative group text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10"
                      : "border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md"
                  } disabled:opacity-50 disabled:cursor-wait`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <span className="absolute -top-2.5 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {pkg.badge}
                    </span>
                  )}

                  {/* Selected Check */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? "bg-emerald-500 text-white"
                        : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Package Name */}
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    {pkg.label}
                  </p>

                  {/* Credits */}
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mb-0.5">
                    {pkg.credits.toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-400 mb-3">Credits</p>

                  {/* Price */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${pkg.price}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      ${perCredit}/credit
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Checkout Form */}
        <div>
          {isCreatingIntent && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-sm font-medium text-neutral-500">
                Initializing secure payment...
              </p>
            </div>
          )}

          {clientSecret && selectedPackage && !isCreatingIntent && (
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Complete Payment
              </h3>

              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#00BC7D",
                      borderRadius: "12px",
                      fontFamily: "system-ui, sans-serif",
                    },
                  },
                }}
              >
                <CheckoutForm
                  packageName={selectedPackage.label}
                  credits={selectedPackage.credits}
                  amount={selectedPackage.price}
                  userEmail={userEmail}
                  onCancel={handleCancelCheckout}
                />
              </Elements>
            </div>
          )}

          {!clientSecret && !isCreatingIntent && (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-white dark:bg-neutral-900 rounded-3xl p-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-base font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                Select a Package
              </h3>
              <p className="text-sm text-neutral-400 text-center max-w-xs">
                Choose a credit package from the left to begin the secure
                checkout process.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
