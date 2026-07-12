"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  packageName: string;
  credits: number;
  amount: number;
  userEmail: string;
  onCancel: () => void;
}

export function CheckoutForm({
  packageName,
  credits,
  amount,
  userEmail,
  onCancel,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/supporter/dashboard/payments`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const saveResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/payments`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userEmail,
              creditsPurchased: credits,
              packageName,
              amountPaid: amount,
              transactionId: paymentIntent.id,
              paymentMethod: paymentIntent.payment_method_types?.[0] || "card",
            }),
          }
        );

        const saveData = await saveResponse.json();

        if (!saveData.success) {
          toast.error("Payment succeeded but failed to record. Contact support.");
          return;
        }

        toast.success(`🎉 ${credits.toLocaleString()} credits added!`, { duration: 4000 });
        router.push("/supporter/dashboard/payments");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment element */}
      <PaymentElement
        options={{ layout: { type: "tabs", defaultCollapsed: false } }}
      />

      {/* Error */}
      {errorMessage && (
        <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-medium rounded-2xl p-4">
          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-emerald-500 dark:hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-lg transition-all duration-200"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Pay ${amount} — {credits.toLocaleString()} Credits
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="sm:w-28 py-4 rounded-2xl font-bold text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 transition-all"
        >
          Cancel
        </button>
      </div>

      {/* Security note */}
      <p className="text-center text-xs font-medium text-neutral-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        Secured by Stripe · Your card is never stored on our servers
      </p>
    </form>
  );
}
