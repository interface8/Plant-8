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

export interface InvestmentResult {
  totalCost: number;
  estimatedRevenue: number;
  adjustedRevenue: number;
  netReturn: number;
  roiPercent: number;
  roiPerDay: number;
  adjustedYield: number;
  effectiveDaysToHarvest: number;
  estimatedHarvestQuantity: number;
}

export function calculateInvestmentROI(
  investmentAmount: number,
  product: Product,
  land: Land,
  noOfPlots: number,
  numberOfFarmers: number,
  terms: number // number of harvest cycles (e.g., 3 terms = 3 harvests)
): InvestmentResult {
  // === BASE VALUES ===
  const {
    fullPlotPrice: landPrice,
    farmerDailyWage,
    fertilizerCostPerPlot,
    inspectionDailyFee,
    inflationRate,
  } = land;

  const {
    estimatedHarvestQuantityPerPlot,
    daysToHarvestPerPlot,
    minimumNoOfFarmersPerPlot,
    currentMarketPricePerKg,
  } = product;

  // === DYNAMIC ADJUSTMENTS ===
  const farmerEfficiency =
    numberOfFarmers / (minimumNoOfFarmersPerPlot * noOfPlots);
  const effectiveDaysToHarvestPerTerm = Math.max(
    1,
    Math.round(daysToHarvestPerPlot * (1 / Math.min(farmerEfficiency, 1.5)))
  );

  // More farmers => slightly better yield (up to 20%)
  const yieldEfficiencyBoost = Math.min(farmerEfficiency, 1.2);

  // Per term yield (with efficiency)
  const yieldPerTerm =
    estimatedHarvestQuantityPerPlot * noOfPlots * yieldEfficiencyBoost;

  // === APPLY TERMS ===
  const effectiveDaysToHarvest =
    effectiveDaysToHarvestPerTerm * terms;

  const estimatedHarvestQuantity = yieldPerTerm * terms;

  // === COST CALCULATIONS ===
  const setupCost = (landPrice / 365) * effectiveDaysToHarvestPerTerm * noOfPlots; // one-time land cost
  const labourCost =
    farmerDailyWage *
    effectiveDaysToHarvestPerTerm *
    numberOfFarmers *
    noOfPlots *
    terms; // repeats per term

  const fertilizerCost = fertilizerCostPerPlot * noOfPlots * terms;
  const inspectionCost = inspectionDailyFee * effectiveDaysToHarvestPerTerm * terms;

  const totalCost = setupCost + labourCost + fertilizerCost + inspectionCost;

  // === REVENUE CALCULATIONS ===
  const inflationAdjustedPrice = currentMarketPricePerKg * (1 + inflationRate);
  const estimatedRevenue = estimatedHarvestQuantity * currentMarketPricePerKg;
  const adjustedRevenue = estimatedHarvestQuantity * inflationAdjustedPrice;

  // === RETURNS ===
  const netReturn = adjustedRevenue - totalCost;
  const roiPercent = (netReturn / investmentAmount) * 100;
  const roiPerDay = roiPercent / effectiveDaysToHarvest;

  return {
    totalCost,
    estimatedRevenue,
    adjustedRevenue,
    netReturn,
    roiPercent,
    roiPerDay,
    adjustedYield: estimatedHarvestQuantity,
    effectiveDaysToHarvest,
    estimatedHarvestQuantity,
  };
}

