"use client";
import { useSelector } from "react-redux";
import type { InvestmentState } from "@/store/slices/investmentSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function InvestmentSummaryForm() {
  const router = useRouter();
  const investment = useSelector((state: { investment: InvestmentState }) => state.investment);
  const product = investment.product;
  const land = investment.land;
  const durationName = investment.durationName;
  const plotSize = investment.plotSize;
  const numberOfPlots = investment.numberOfPlots;
  const numberOfTerms = investment.numberOfTerms;
  const numberOfFarmers = investment.numberOfFarmers;
  const landCost = investment.landCost || 0;
  const totalInvestment = investment.totalInvestment || 0;
  const expectedReturn = investment.expectedReturn || 0;
  const roi = product?.roi ?? 0;
  const totalPayout = expectedReturn;

  if (!product || !land) {
    return <div className="max-w-xl mx-auto p-8 text-center text-gray-400">Missing product or land data.</div>;
  }
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center mb-4">Investment Summary</h2>
        {/* Product Section */}
        <div className="border-b pb-4 mb-4">
          <div className="flex items-center gap-4">
            {product.images && typeof product.images[0] === 'string' && product.images[0].trim() !== '' && (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-lg border"
                priority
              />
            )}
            <div>
              <div className="font-semibold text-lg">{product.name}</div>
              <div className="text-gray-500 text-sm">{product.description}</div>
              <div className="text-xs text-gray-400 mt-1">Type: {product.ProductType?.name}</div>
            </div>
          </div>
        </div>
        {/* Land Section */}
        <div className="border-b pb-4 mb-4">
          <div className="font-semibold mb-1">Land</div>
          <div className="text-gray-700">{land.name} ({land.location?.name}, {land.location?.state?.name})</div>
          <div className="text-xs text-gray-500 mt-1">GPS: {land.gpsCoordinates || 'N/A'}</div>
        </div>
        {/* Investment Details Section */}
        <div className="grid grid-cols-2 gap-4 border-b pb-4 mb-4">
          <div>
            <div className="text-xs text-gray-500">Plot Size</div>
            <div className="font-medium">{plotSize}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Number of Plots</div>
            <div className="font-medium">{numberOfPlots}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Number of Farmers</div>
            <div className="font-medium">{numberOfFarmers}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Number of Terms</div>
            <div className="font-medium">{numberOfTerms}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="font-medium">{durationName}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Land Cost</div>
            <div className="font-medium">₦{landCost.toLocaleString()}</div>
          </div>
        </div>
        {/* Returns Section */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Total Investment</span>
            <span className="font-semibold text-[#145C33]">₦{totalInvestment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Expected Return (ROI {roi}%)</span>
            <span className="font-semibold text-[#1E7B47]">+₦{(expectedReturn - totalInvestment).toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="font-semibold">Total Payout</span>
            <span className="font-bold text-[#1E7B47]">₦{totalPayout.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => router.push("/payment")}
          className="w-full bg-[#1E7B47] text-white px-4 py-2 rounded-md hover:bg-[#145C33] transition-colors font-semibold mt-4"
        >
          Proceed to Pay ₦{totalInvestment.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
