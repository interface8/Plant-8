import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InvestmentStepState {
  currentStep: number;
}

const initialState: InvestmentStepState = {
  currentStep: 1,
};

const investmentStepSlice = createSlice({
  name: "investmentStep",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < 4) state.currentStep += 1;
    },
    prevStep(state) {
      if (state.currentStep > 1) state.currentStep -= 1;
    },
    resetStep(state) {
      state.currentStep = 1;
    },
  },
});

export const { setStep, nextStep, prevStep, resetStep } =
  investmentStepSlice.actions;
export default investmentStepSlice.reducer;
