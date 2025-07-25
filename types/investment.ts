export interface InvestmentFormData {
  productId: string;
  productTypeId: string;
  amount: number;
}

export enum InvestmentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Investment {
  id: string;
  userId: string;
  inspectorId?: string | null;
  productId: string;
  productTypeId: string;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: InvestmentStatus;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt?: string | null;
  modifiedBy?: string | null;
  user: {
    id: string;
    name?: string | null;
  };
  product: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
  productType: {
    id: string;
    name: string;
  };
}
