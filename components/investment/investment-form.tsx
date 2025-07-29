"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { z } from "zod";
import { investmentSchema } from "@/lib/validators/investment-schema-validators";

type InvestmentFormData = z.infer<typeof investmentSchema>;

interface InvestmentFormProps {
  productId: string;
  productTypeId: string;
}

export default function InvestmentForm({
  productId,
  productTypeId,
}: InvestmentFormProps) {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<Pick<InvestmentFormData, "amount">>({
    amount: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to invest.");
      return;
    }

    const data: InvestmentFormData = {
      userId: session.user.id,
      productId,
      productTypeId,
      amount: formData.amount,
    };

    const parsed = investmentSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create investment");
      }

      const result = await response.json();
      setSuccess(result.message);
      setFormData({ amount: 0 });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create investment"
      );
    } finally {
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
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Investment Amount (₦)
        </label>
        <input
          id="amount"
          type="number"
          value={formData.amount || ""}
          onChange={(e) =>
            setFormData({ amount: parseFloat(e.target.value) || 0 })
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter amount (min ₦100)"
          min="100"
          step="0.01"
          required
          aria-describedby={error ? "amount-error" : undefined}
        />
        {error && (
          <p id="amount-error" className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
        {success && <p className="text-green-500 text-sm mt-1">{success}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
        } transition-colors`}
        aria-label="Invest in this product"
      >
        {isSubmitting ? "Submitting..." : "Invest Now"}
      </button>
    </form>
  );
}
