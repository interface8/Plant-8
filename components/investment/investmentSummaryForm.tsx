"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setError,
  setInvestmentData,
  setFarmerMonthlyPayment,
} from "@/store/slices/investmentSlice";
import { Product } from "@/types/product";
import { Land } from "@/types/land";

interface InvestmentSummaryFormProps {
  product: Product;
  land: Land;
  duration: { id: string; name: string };
  plotSize: "HALF" | "FULL";
  numberOfPlots: number;
  numberOfTerms: number;
}

export default function InvestmentSummaryForm({
  product,
  land,
  duration,
  plotSize,
  numberOfPlots,
  numberOfTerms,
}: InvestmentSummaryFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const dispatch = useDispatch();
  const investmentData = useSelector((state: RootState) => state.investment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setFarmerMonthlyPayment(product.farmerMonthlyPayment));
    const plotPrice =
      plotSize === "HALF" ? land.halfPlotPrice : land.fullPlotPrice;
    const durationMonths = parseInt(
      duration.name.match(/(\d+)\s*month/i)?.[1] || "1"
    );
    const farmerCost =
      product.farmerMonthlyPayment *
      durationMonths *
      numberOfTerms *
      numberOfPlots;
    const plotCost = plotPrice * numberOfPlots * numberOfTerms;
    const total = plotCost + farmerCost;

    dispatch(
      setInvestmentData({
        productId: product.id,
        productTypeId: product.productTypeId,
        landId: land.id,
        plotSize,
        numberOfPlots,
        numberOfTerms,
        durationId: duration.id,
        amount: total,
        userId: session?.user?.id || "",
      })
    );
  }, [
    dispatch,
    product,
    land,
    duration,
    plotSize,
    numberOfPlots,
    numberOfTerms,
    session,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated" || !session?.user?.id) {
      dispatch(setError("Please sign in to confirm investment."));
      return;
    }

    dispatch(setError(null));
    setIsSubmitting(true);

    try {
      router.push(
        `/investments/payment?productId=${product.id}&productTypeId=${product.productTypeId}&landId=${land.id}&plotSize=${plotSize}&numberOfPlots=${numberOfPlots}&durationId=${duration.id}&numberOfTerms=${numberOfTerms}`
      );
    } catch {
      dispatch(setError("Failed to proceed. Please try again."));
      setIsSubmitting(false);
    }
  };

  if (status !== "authenticated") {
    return (
      <div className="mt-6">
        <a
          href="/sign-in"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          aria-label="Sign in to invest"
        >
          Sign In to Invest
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Investment Summary</h3>
        <p className="text-gray-600">Crop: {product.name}</p>
        <p className="text-gray-600">
          Land: {land.name}, {land.location?.name || "N/A"},{" "}
          {land.location?.state?.name || "N/A"}
        </p>
        <p className="text-gray-600">Plot Size: {plotSize}</p>
        <p className="text-gray-600">Number of Plots: {numberOfPlots}</p>
        <p className="text-gray-600">Duration: {duration.name}</p>
        <p className="text-gray-600">Number of Terms: {numberOfTerms}</p>
        <p className="text-gray-600">
          Farmer Monthly Payout: ₦
          {product.farmerMonthlyPayment.toLocaleString()} per plot
        </p>
        <p className="text-gray-600">
          Total Investment: ₦{investmentData.amount.toLocaleString()}
        </p>
        <p className="text-gray-600">
          Expected Return: ₦{(investmentData.amount * 1.2).toLocaleString()}
        </p>
      </div>
      {investmentData.error && (
        <p className="text-red-500 text-sm">{investmentData.error}</p>
      )}
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
