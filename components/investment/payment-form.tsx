"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { InvestmentState } from "@/store/slices/investmentSlice";
import { setError } from "@/store/slices/investmentSlice";
import { useSession } from "next-auth/react";

interface PaymentFormProps {
  onSuccess?: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const investmentData = useSelector((state: { investment: InvestmentState }) => state.investment);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handlePayment = async () => {
    setIsSubmitting(true);
    dispatch(setError(null));

    if (!session?.user?.id) {
      dispatch(setError("Please sign in to complete the payment."));
      setIsSubmitting(false);
      return;
    }

    if (
      !investmentData.productId ||
      !investmentData.productTypeId ||
      !investmentData.landId ||
      !investmentData.durationId
    ) {
      dispatch(setError("Invalid investment data."));
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          productId: investmentData.productId,
          productTypeId: investmentData.productTypeId,
          landId: investmentData.landId,
          plotSize: investmentData.plotSize,
          numberOfPlots: investmentData.numberOfPlots,
          numberOfTerms: investmentData.numberOfTerms,
          durationId: investmentData.durationId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.investment) {
        dispatch(setError(null));
        onSuccess?.();
        setIsNavigating(true);
        router.push("/dashboard?payment=success");
      } else {
        dispatch(setError(result.error || "Failed to create investment."));
      }
    } catch {
      dispatch(setError("Payment failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isNavigating) {
    return <p>Navigating to dashboard...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Complete Payment</h1>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Total Investment: ₦{investmentData.totalInvestment?.toLocaleString()}
          </p>
        </div>
        {investmentData.error && (
          <p className="text-red-500 text-sm">{investmentData.error}</p>
        )}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isSubmitting || !session?.user?.id}
          className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
            isSubmitting || !session?.user?.id
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-700"
          } transition-colors`}
          aria-label="Complete Payment"
        >
          {isSubmitting ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
