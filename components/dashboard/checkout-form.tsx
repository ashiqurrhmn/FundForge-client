"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";

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

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/supporter/dashboard/payments`,
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Save payment record & increment credits
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
              paymentMethod:
                paymentIntent.payment_method_types?.[0] || "card",
            }),
          }
        );

        const saveData = await saveResponse.json();

        if (!saveData.success) {
          toast.error("Payment succeeded but failed to record. Contact support.");
          setIsProcessing(false);
          return;
        }

        toast.success(
          `🎉 ${credits} credits added to your account!`,
          { duration: 4000 }
        );

        // Redirect to payment history
        router.push("/supporter/dashboard/payments");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      {/* Order Summary */}
      <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-5 mb-6">
        <h4 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-3 uppercase tracking-wider">
          Order Summary
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-neutral-800 dark:text-white">
              {packageName} Package
            </p>
            <p className="text-sm text-neutral-500">
              {credits.toLocaleString()} Credits
            </p>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${amount}
          </p>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-neutral-800/50 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700/50 mb-5">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 text-sm rounded-xl p-4 mb-5 flex items-start gap-2">
            <svg
              className="w-5 h-5 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {errorMessage}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!stripe || !elements || isProcessing}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 dark:bg-[#004F3B] hover:bg-emerald-600 dark:hover:bg-[#008f5d] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-500/25 dark:shadow-[#004F3B]/25 transition-all text-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Pay ${amount}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>

        {/* Security Note */}
        <p className="text-center text-xs text-neutral-400 mt-4 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3" />
          Payments are secured by Stripe. Your card details never touch our
          servers.
        </p>
      </form>
    </div>
  );
}
