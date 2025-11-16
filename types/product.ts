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
  images: string[];
  currentMarketPricePerKg: number;
  farmerMonthlyPayment: number;
  roi: number | null;
  estimatedHarvestQuantityPerPlot: number;
  daysToHarvestPerPlot: number;
  minimumNoOfFarmersPerPlot: number;
  dailyMaintenanceFee: number;
  ProductType: {
    id: string;
    name: string;
  };
  duration: {
    id: string;
    name: string;
  };
  // Optional theme properties stored as JSON in the database
  cssThemeProperty?: {
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
    gradient?: string | null;
  } | null;
}

