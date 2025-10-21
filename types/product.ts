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

