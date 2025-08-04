"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PaymentFormProps {
  investmentId: string;
  amount: number;
}

export default function PaymentForm({
  investmentId,
  amount,
}: PaymentFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated") {
      setError("Please sign in to proceed with payment.");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Placeholder for payment processing logic
      // In a real application, integrate with a payment gateway (e.g., Stripe, Paystack)
      alert(
        `Payment of ₦${amount.toLocaleString()} via ${paymentMethod} would be processed here.`
      );
      router.push("/investments?success=true");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to process payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <div className="mt-6">
        <Link
          href="/sign-in"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          aria-label="Sign in to pay"
        >
          Sign In to Pay
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Payment Method</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Credit/Debit Card
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="bank"
              checked={paymentMethod === "bank"}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2"
            />
            Bank Transfer
          </label>
          {/* Add more payment methods as needed */}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting || !paymentMethod}
        className={`w-full bg-green-600 text-white px-4 py-2 rounded-md ${
          isSubmitting || !paymentMethod
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-700"
        } transition-colors`}
        aria-label="Complete Payment"
      >
        {isSubmitting ? "Processing..." : `Pay ₦${amount.toLocaleString()}`}
      </button>
    </form>
  );
}
