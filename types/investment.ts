export interface InvestmentFormData {
  userId: string;
  productId: string;
  productTypeId: string;
  landId: string;
  plotSize: "HALF" | "FULL";
  numberOfPlots: number;
  farmerMonthlyPayment: number;
  numberOfTerms: number;
  durationId: string;
  amount: number;
}

export interface Investment {
  id: string;
  userId: string;
  inspectorId: string | null;
  productId: string;
  productTypeId: string;
  landId: string | null;
  plotSize: string | null;
  numberOfPlots: number;
  numberOfTerms: number;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  createdAt: Date;
  createdBy: string | null;
  modifiedAt: Date | null;
  modifiedBy: string | null;
  product: {
    id: string;
    name: string;
    images: string[];
    farmerMonthlyPayment: number;
    roi: number | null;
    duration: { id: string; name: string };
  };
  productType: { id: string; name: string };
  land: {
    id: string;
    name: string;
    gpsCoordinates: string | null;
    halfPlotPrice: number;
    fullPlotPrice: number;
    location: {
      id: string;
      name: string;
      state: { id: string; name: string };
    };
  } | null;
}
