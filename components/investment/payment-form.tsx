"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setError, setInvestmentData } from "@/store/slices/investmentSlice";
import prisma from "@/db/prisma";
import { useSession } from "next-auth/react";

export default function PaymentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const investmentData = useSelector((state: RootState) => state.investment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const productId = searchParams.get("productId") || "";
    const productTypeId = searchParams.get("productTypeId") || "";
    const landId = searchParams.get("landId") || "";
    const plotSize =
      (searchParams.get("plotSize") as "HALF" | "FULL") || "FULL";
    const numberOfPlots = parseInt(searchParams.get("numberOfPlots") || "1");
    const durationId = searchParams.get("durationId") || "";
    const numberOfTerms = parseInt(searchParams.get("numberOfTerms") || "1");

    dispatch(
      setInvestmentData({
        productId,
        productTypeId,
        landId,
        plotSize,
        numberOfPlots,
        numberOfTerms,
        durationId,
        userId: session?.user?.id || "",
        amount: investmentData.amount,
      })
    );
  }, [dispatch, searchParams, session, investmentData.amount]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    dispatch(setError(null));

    if (!session?.user?.id) {
      dispatch(setError("Please sign in to complete the payment."));
      setIsSubmitting(false);
      return;
    }

    if (!investmentData.productId || !investmentData.productTypeId) {
      dispatch(setError("Invalid investment data."));
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate payment processing (replace with actual payment gateway logic)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save investment to database
      await prisma.investment.create({
        data: {
          userId: session.user.id,
          productId: investmentData.productId,
          productTypeId: investmentData.productTypeId,
          landId: investmentData.landId,
          plotSize: investmentData.plotSize,
          numberOfPlots: investmentData.numberOfPlots,
          numberOfTerms: investmentData.numberOfTerms,
          amount: investmentData.amount,
          expectedReturn: investmentData.amount * 1.2,
          progress: 0,
          status: "PENDING",
          createdAt: new Date(),
          createdBy: session.user.id,
        },
      });

      router.push("/dashboard?payment=success");
    } catch {
      dispatch(setError("Payment failed. Please try again."));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Complete Payment</h1>
      <form onSubmit={handlePayment} className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700">
            Investment Amount: ₦{investmentData.amount.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-gray-700">
            Farmer Monthly Payout: ₦
            {investmentData.farmerMonthlyPayment?.toLocaleString() || "N/A"}
          </p>
        </div>
        {investmentData.error && (
          <p className="text-red-500 text-sm">{investmentData.error}</p>
        )}
        <button
          type="submit"
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
      </form>
    </div>
  );
}
