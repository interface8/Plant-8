import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvestmentFormData } from "@/types/investment";

interface InvestmentState extends InvestmentFormData {
  farmerMonthlyPayment: number;
  error?: string | null;
}

const initialState: InvestmentState = {
  userId: "",
  productId: "",
  productTypeId: "",
  landId: "",
  plotSize: "FULL",
  numberOfPlots: 1,
  numberOfTerms: 1,
  durationId: "",
  amount: 0,
  farmerMonthlyPayment: 0,
  error: null,
};

const investmentSlice = createSlice({
  name: "investment",
  initialState,
  reducers: {
    setInvestmentData(
      state,
      action: PayloadAction<Partial<InvestmentFormData>>
    ) {
      return { ...state, ...action.payload };
    },
    setFarmerMonthlyPayment(state, action: PayloadAction<number>) {
      state.farmerMonthlyPayment = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setInvestmentData, setFarmerMonthlyPayment, setError } =
  investmentSlice.actions;
export default investmentSlice.reducer;
