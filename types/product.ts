export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  prevId?: string | null;
  children: ProductType[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  productTypeId: string;
  durationId: string;
  imageUrl: string;
  currentMarketPricePerKg: number;
  farmerMonthlyPayment: number;
  roi: number | null;
  ProductType: {
    id: string;
    name: string;
  };
  duration: {
    id: string;
    name: string;
  };
}

export interface Investment {
  id: string;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: string;
  createdAt: string;
  product: { name: string; imageUrl: string };
}
