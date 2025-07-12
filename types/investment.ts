import { UserType } from "./user";

export interface AuthState {
  user: UserType | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNo?: string;
  image?: string | null;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  addresses: Address[];
  modifiedById?: string | null;
  modifiedOn?: string | null;
}

export interface Address {
  id: string;
  no: string;
  line1: string;
  phoneNo: string;
  state: string;
  city: string;
  code?: string;
  gps?: string;
  useAsDelivery: boolean;
  addressType: { id: string; name: string };
  modifiedById?: string | null;
  modifiedOn?: string | null;
}

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
  createdAt: string;
  updatedAt: string;
  productTypeId?: string | null; // Added this missing property
  productClassId?: string | null; // Added this missing property
  type?: ProductType;
  class?: ProductType;
}

export interface Investment {
  id: string;
  userId: string;
  productId: string;
  productTypeId: string;
  amount: number;
  expectedReturn: number;
  progress: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  product: Product;
  productType: ProductType;
  user?: UserType; // Using your UserType instead
}

export interface InvestmentFormData {
  productId: string;
  productTypeId: string;
  amount: number;
}
