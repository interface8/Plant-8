import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Select Land" },
  { id: 2, name: "Investment Details" },
  { id: 3, name: "Summary" },
];

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Investment process steps" className="mb-6">
      <ol className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step.id <= currentStep
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                step.id <= currentStep ? "text-green-600" : "text-gray-600"
              }`}
            >
              {step.name}
            </span>
            {step.id < steps.length && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  step.id < currentStep ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
