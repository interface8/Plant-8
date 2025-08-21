"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import StepIndicator from "@/components/investment/step-indicator";
import LandSelectionForm from "@/components/investment/land-selection-form";
import InvestmentDetailsForm from "@/components/investment/investmentDetailsForm";
import InvestmentSummaryForm from "@/components/investment/investmentSummaryForm";
import PaymentForm from "@/components/investment/payment-form";
import { useEffect } from "react";
import {
  nextStep,
  prevStep,
  resetStep,
} from "@/store/slices/investmentStepSlice";
import { setInvestmentData, setError } from "@/store/slices/investmentSlice";
import { Product } from "@/types/product";
import { Land } from "@/types/land";
import { State } from "@/types/state";

interface Duration {
  id: string;
  name: string;
}

interface InvestmentStepWrapperProps {
  product: Product;
  lands: Land[];
  states: State[];
  durations: Duration[];
  initialState?: string;
}

export default function InvestmentStepWrapper({
  product,
  lands,
  states,
  durations,
  initialState,
}: InvestmentStepWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useSelector(
    (state: RootState) => state.investmentStep.currentStep
  );
  const investment = useSelector((state: RootState) => state.investment);

  // Initialize investment data on mount
  useEffect(() => {
    dispatch(
      setInvestmentData({
        productId: product.id,
        productTypeId: product.productTypeId,
        durationId: product.durationId,
        plotSize: "FULL",
        numberOfPlots: 1,
        numberOfTerms: 1,
        amount: 0,
        userId: "",
      })
    );
  }, [dispatch, product]);

  // Validation: Go back if data missing for step
  useEffect(() => {
    if (currentStep === 2 && !investment.landId) {
      dispatch(setError("Please select a land before proceeding."));
      dispatch(prevStep());
    } else if (
      currentStep === 3 &&
      (!investment.landId || !investment.durationId)
    ) {
      dispatch(setError("Please complete all previous steps."));
      dispatch(prevStep());
    } else if (
      currentStep === 4 &&
      (!investment.landId || !investment.durationId)
    ) {
      dispatch(setError("Please complete all previous steps."));
      dispatch(prevStep());
    } else {
      dispatch(setError(null));
    }
  }, [currentStep, investment, dispatch]);

  // Derive selected land and duration from IDs
  const selectedLand = lands.find((l) => l.id === investment.landId) || null;
  const selectedDuration =
    durations.find((d) => d.id === investment.durationId) || null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <StepIndicator currentStep={currentStep} />
      {investment.error && (
        <p className="text-red-500 text-sm mb-4">{investment.error}</p>
      )}
      {currentStep === 1 && (
        <LandSelectionForm
          lands={lands}
          states={states}
          initialState={initialState}
          onLandSelect={(landId: string) => {
            dispatch(setInvestmentData({ landId }));
            dispatch(nextStep());
          }}
        />
      )}
      {currentStep === 2 && selectedLand && (
        <InvestmentDetailsForm
          product={product}
          land={selectedLand}
          durations={durations}
          onSubmit={() => dispatch(nextStep())}
        />
      )}
      {currentStep === 3 && selectedLand && selectedDuration && (
        <InvestmentSummaryForm
          product={product}
          land={selectedLand}
          duration={selectedDuration}
          plotSize={investment.plotSize}
          numberOfPlots={investment.numberOfPlots}
          numberOfTerms={investment.numberOfTerms}
          amount={investment.amount}
          onContinue={() => dispatch(nextStep())}
        />
      )}
      {currentStep === 4 && selectedLand && selectedDuration && (
        <PaymentForm
          onSuccess={() => {
            dispatch(resetStep());
            dispatch(
              setInvestmentData({
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
              })
            );
            // No 'error' property here, as it's not in InvestmentFormData
          }}
        />
      )}
    </div>
  );
}
