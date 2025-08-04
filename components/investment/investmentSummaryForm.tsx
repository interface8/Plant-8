"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface InvestmentSummaryFormProps {
  productId: string;
  productTypeId: string;
  landId: string;
  plotSize: string;
  numberOfPlots: number;
  durationId: string;
  numberOfTerms: number;
  totalAmount: number;
}

export default function InvestmentSummaryForm({
  productId,
  productTypeId,
  landId,
  plotSize,
  numberOfPlots,
  durationId,
  numberOfTerms,
  totalAmount,
}: InvestmentSummaryFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to invest.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId,
          productTypeId,
          landId,
          plotSize: plotSize || undefined,
          numberOfPlots,
          numberOfTerms,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create investment");
      }

      const { investment } = await response.json();
      router.push(
        `/investments/payment?investmentId=${investment.id}&amount=${investment.amount}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create investment"
      );
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <div className="mt-6">
        <Link
          href="/sign-in"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          aria-label="Sign in to invest"
        >
          Sign In to Invest
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        } transition-colors`}
        aria-label="Proceed to Payment"
      >
        {isSubmitting ? "Submitting..." : "Proceed to Payment"}
      </button>
    </form>
  );
}
