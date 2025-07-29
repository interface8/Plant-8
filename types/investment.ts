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
  amount: number;
  expectedReturn: number;
  progress: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  createdAt: Date;
  createdBy: string | null;
  modifiedAt: Date | null;
  modifiedBy: string | null;
  product: { id: string; name: string; imageUrl: string | null };
  productType: { id: string; name: string };
}
