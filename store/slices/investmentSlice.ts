
import { calculateInvestmentROI, InvestmentResult } from "@/lib/utils/investmentCalculator";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { InvestmentFormData } from "@/types/investment";
import type { Land } from "@/types/land";
import type { Product } from "@/types/product";

export interface InvestmentState extends InvestmentFormData {
  farmerMonthlyPayment: number;
  error?: string | null;
  product?: Product | null;
  land?: Land | null;
  durationName?: string;
  totalInvestment?: number;
  expectedReturn?: number;
  landCost?: number;

  roiResult?: InvestmentResult;
}

const initialState: InvestmentState = {
  userId: "",
  productId: "",
  productTypeId: "",
  landId: "",
  plotSize: "FULL",
  numberOfPlots: 1,
  numberOfTerms: 1,
  numberOfFarmers: 1,
  durationId: "",
  amount: 0,
  farmerMonthlyPayment: 0,
  error: null,
  product: null,
  land: null,
  durationName: undefined,
  totalInvestment: 0,
  expectedReturn: 0,
  landCost: 0,
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    setInvestmentData(
      state,
      action: PayloadAction<Partial<InvestmentFormData> & { product?: Product; land?: Land; durationName?: string }>
    ) {
      Object.assign(state, action.payload);
      // If we have product and land, recalculate
      if (state.product && state.land) {
        const calc = calculateInvestmentROI(
          state.amount || 0,
          state.product,
          state.land,
          state.numberOfPlots || 1,
          state.numberOfFarmers || 1,
          state.numberOfTerms || 1
        );
        state.roiResult = calc;
      }
    },
    setFarmerMonthlyPayment(state, action: PayloadAction<number>) {
      state.farmerMonthlyPayment = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setProduct(state, action: PayloadAction<Product | null>) {
      state.product = action.payload;
    },
    setLand(state, action: PayloadAction<Land | null>) {
      state.land = action.payload;
    },
    setDurationName(state, action: PayloadAction<string | undefined>) {
      state.durationName = action.payload;
    },
  },
});

export const { setInvestmentData, setFarmerMonthlyPayment, setError, setProduct, setLand, setDurationName } =
  investmentSlice.actions;
export default investmentSlice.reducer;
