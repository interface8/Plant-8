export interface InvestmentFormData {
  productId: string;
  productTypeId: string;
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
    imageUrl: string | null;
    duration: { id: string; name: string };
  };
  productType: { id: string; name: string };
  land: {
    id: string;
    name: string;
    gpsCoordinates: string | null;
    halfPlotPrice: number;
    fullPlotPrice: number;
    location?: {
      id: string;
      name: string;
      state?: { id: string; name: string };
    };
  } | null;
}

// export interface Investment {
//   id: string;
//   userId: string;
//   inspectorId: string | null;
//   productId: string;
//   productTypeId: string;
//   amount: number;
//   expectedReturn: number;
//   progress: number;
//   status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
//   createdAt: Date;
//   createdBy: string | null;
//   modifiedAt: Date | null;
//   modifiedBy: string | null;
//   product: { id: string; name: string; imageUrl: string | null };
//   productType: { id: string; name: string };
// }
