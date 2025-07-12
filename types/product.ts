export interface ProductType {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  prevId?: string | null;
  growthDuration?: string;
  expectedReturnRate?: number;
  durationId?: string | null;
  parent?: ProductType | null;
  children: ProductType[];
  duration?: ProductType | null;
  productsByType: Product[];
  productsByClass: Product[];
  productTypeInvestments: Investment[];
  href?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  currentMarketPricePerKg: number;
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
