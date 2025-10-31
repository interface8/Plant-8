// utils/investmentCalculator.ts
import type { Land } from "@/types/land";
import type { Product } from "@/types/product";

export interface InvestmentCalcInput {
  land: Land;
  product: Product;
  noOfPlots: number;
  numberOfFarmers: number;
  terms: number;
  investmentAmount: number;
}


export interface InvestmentCalcResult {
  landCost: number;
  totalInvestment: number;
  expectedReturn: number;
  netProfit: number;
  farmersCostPerTerm: number;
  fertilizerCost: number;
  inspectionCostPerTerm: number;
}


export function calculateInvestment({
  land,
  product,
  noOfPlots,
  numberOfFarmers,
  terms,
  investmentAmount,
}: InvestmentCalcInput): InvestmentCalcResult {
  // Fallbacks to prevent NaN
  const plotPrice = typeof land.fullPlotPrice === 'number' && land.fullPlotPrice > 0
    ? land.fullPlotPrice
    : (typeof land.halfPlotPrice === 'number' && land.halfPlotPrice > 0 ? land.halfPlotPrice : 0);
  const landCost = plotPrice * noOfPlots;
  const farmersCostPerTerm = (land.farmerDailyWage || 0) * (product.daysToHarvestPerPlot || 0) * (numberOfFarmers || 1) * (noOfPlots || 1);
  const fertilizerCost = (land.fertilizerCostPerPlot || 0) * (noOfPlots || 1);
  const inspectionCostPerTerm = (land.inspectionDailyFee || 0) * (product.daysToHarvestPerPlot || 0);
  const subtotalPerTerm = investmentAmount + landCost + farmersCostPerTerm + fertilizerCost + inspectionCostPerTerm;
  const totalInvestment = subtotalPerTerm * (terms || 1);
  const expectedReturn = totalInvestment * (1 + ((product.roi ?? 0) / 100));
  const netProfit = expectedReturn - totalInvestment;

  return {
    landCost,
    totalInvestment,
    expectedReturn,
    netProfit,
    farmersCostPerTerm,
    fertilizerCost,
    inspectionCostPerTerm,
  };
}
