"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Product } from "@/types/product";
import { Land } from "@/types/land";

interface Duration {
  id: string;
  name: string;
}

interface InvestmentSummaryFormProps {
  product: Product;
  land: Land;
  duration: Duration;
  plotSize: "HALF" | "FULL";
  numberOfPlots: number;
  numberOfTerms: number;
  amount: number;
  onContinue?: () => void;
}

export default function InvestmentSummaryForm({
  product,
  land,
  duration,
  plotSize,
  numberOfPlots,
  numberOfTerms,
  amount,
  onContinue,
}: InvestmentSummaryFormProps) {
  const investment = useSelector((state: RootState) => state.investment);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Investment Summary</h2>
      <div>
        <p>
          <strong>Product:</strong> {product.name} ({product.description})
        </p>
        <p>
          <strong>Land:</strong> {land.name} in {land.location.name},{" "}
          {land.location.state.name}
        </p>
        <p>
          <strong>Plot Size:</strong> {plotSize}
        </p>
        <p>
          <strong>Number of Plots:</strong> {numberOfPlots}
        </p>
        <p>
          <strong>Duration:</strong> {duration.name}
        </p>
        <p>
          <strong>Number of Terms:</strong> {numberOfTerms}
        </p>
        <p>
          <strong>Total Amount:</strong> ₦{amount.toLocaleString()}
        </p>
        <p>
          <strong>Expected Return:</strong> ₦{(amount * 1.2).toLocaleString()}{" "}
          (20% estimated)
        </p>
      </div>
      {investment.error && (
        <p className="text-red-500 text-sm">{investment.error}</p>
      )}
      <button
        onClick={onContinue}
        className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        aria-label="Proceed to Payment"
      >
        Proceed to Payment
      </button>
    </div>
  );
}
