/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setInvestmentData,
  setFarmerMonthlyPayment,
  setError,
} from "@/store/slices/investmentSlice";
import { z } from "zod";
import { Land } from "@/types/land";
import { Product } from "@/types/product";

const investmentDetailsSchema = z.object({
  plotSize: z.enum(["HALF", "FULL"]).optional(),
  numberOfPlots: z
    .number()
    .int()
    .min(1, "Select at least 1 plot")
    .max(10, "Cannot select more than 10 plots"),
  durationId: z.string().uuid("Please select a duration"),
  numberOfTerms: z
    .number()
    .int()
    .min(1, "Select at least 1 term")
    .max(4, "Cannot select more than 4 terms"),
});

interface InvestmentDetailsFormProps {
  product: Product;
  land: Land;
  durations: { id: string; name: string }[];
  onSubmit?: () => void; // Added for advancing step
}

export default function InvestmentDetailsForm({
  product,
  land,
  durations,
  onSubmit,
}: InvestmentDetailsFormProps) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const investmentData = useSelector((state: RootState) => state.investment);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(setFarmerMonthlyPayment(product.farmerMonthlyPayment));

    const plotPrice =
      investmentData.plotSize === "HALF"
        ? land.halfPlotPrice
        : land.fullPlotPrice;
    const farmerMonthlyPayment = product.farmerMonthlyPayment;
    const duration = durations.find((d) => d.id === investmentData.durationId);
    const monthsMatch = duration?.name.match(/(\d+)\s*month/i);
    const durationMonths = monthsMatch ? parseInt(monthsMatch[1]) : 1;
    const plotCost =
      plotPrice * investmentData.numberOfPlots * investmentData.numberOfTerms;
    const farmerCost =
      farmerMonthlyPayment * durationMonths * investmentData.numberOfTerms;
    const total = plotCost + farmerCost;
    dispatch(setInvestmentData({ amount: total }));
  }, [
    investmentData.plotSize,
    investmentData.numberOfPlots,
    investmentData.numberOfTerms,
    investmentData.durationId,
    land,
    durations,
    dispatch,
    product,
    product.farmerMonthlyPayment,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "authenticated" || !session?.user?.id) {
      dispatch(setError("Please sign in to invest."));
      return;
    }

    const parsed = investmentDetailsSchema.safeParse({
      plotSize: investmentData.plotSize,
      numberOfPlots: investmentData.numberOfPlots,
      durationId: investmentData.durationId,
      numberOfTerms: investmentData.numberOfTerms,
    });
    if (!parsed.success) {
      dispatch(setError(parsed.error.errors[0].message));
      return;
    }

    dispatch(setError(null));
    setIsSubmitting(true);

    try {
      onSubmit?.(); // Call callback to advance
    } catch (err) {
      dispatch(setError("Failed to proceed. Please try again."));
    } finally {
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
        <h3 className="text-lg font-semibold mb-2">Crop Information</h3>
        <p className="text-gray-600">
          {product.name} - {product.description}
        </p>
      </div>
      <div>
        <label
          htmlFor="plotSize"
          className="block text-sm font-medium text-gray-700"
        >
          Plot Size
        </label>
        <select
          id="plotSize"
          value={investmentData.plotSize || ""}
          onChange={(e) =>
            dispatch(
              setInvestmentData({ plotSize: e.target.value as "HALF" | "FULL" })
            )
          }
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="HALF">
            Half Plot (₦{land.halfPlotPrice.toLocaleString()})
          </option>
          <option value="FULL">
            Full Plot (₦{land.fullPlotPrice.toLocaleString()})
          </option>
        </select>
      </div>
      <div>
        <label
          htmlFor="numberOfPlots"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Plots (1-10)
        </label>
        <input
          type="number"
          id="numberOfPlots"
          value={investmentData.numberOfPlots}
          onChange={(e) =>
            dispatch(
              setInvestmentData({ numberOfPlots: parseInt(e.target.value) })
            )
          }
          min="1"
          max="10"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="durationId"
          className="block text-sm font-medium text-gray-700"
        >
          Duration
        </label>
        <select
          id="durationId"
          value={investmentData.durationId || ""}
          disabled={true}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500 opacity-50 cursor-not-allowed"
          required
        >
          {durations.map((duration) => (
            <option key={duration.id} value={duration.id}>
              {duration.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="numberOfTerms"
          className="block text-sm font-medium text-gray-700"
        >
          Number of Terms (1-4)
        </label>
        <input
          type="number"
          id="numberOfTerms"
          value={investmentData.numberOfTerms}
          onChange={(e) =>
            dispatch(
              setInvestmentData({ numberOfTerms: parseInt(e.target.value) })
            )
          }
          min="1"
          max="4"
          className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-green-500 focus:border-green-500"
          required
        />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">
          Farmer Monthly Payout: ₦
          {product.farmerMonthlyPayment.toLocaleString()} per plot
        </p>
        <p className="text-sm font-medium text-gray-700">
          Estimated Total: ₦{investmentData.amount.toLocaleString()}
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
        aria-label="Proceed to Investment Summary"
      >
        {isSubmitting ? "Submitting..." : "View Investment Summary"}
      </button>
    </form>
  );
}
