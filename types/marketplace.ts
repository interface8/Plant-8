export interface MarketplaceListing {
  id: string;
  investmentId: string;
  productId: string;
  quantityKg: number;
  pricePerKg: number;
  totalValue: number;
  status: string;
  isNegotiable: boolean;
  marketRating?: number | null;
  harvestDate: Date | string;
  expiryDate?: Date | string | null;
  description?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  investment?: {
    userId: string;
    user: {
      name: string;
      email: string;
      image?: string | null;
    };
  };
  investor?: {
    name: string;
    image?: string | null;
  };
  product?: {
    id: string;
    name: string;
    description: string;
    images?: string[];
    ProductType: {
      name: string;
    };
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  listingId: string;
  quantityKg: number;
  pricePerKg: number;
  subtotal: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  listing?: MarketplaceListing;
}

export interface Order {
  id: string;
  buyerId?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  deliveryAddress: string;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  notes?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  orderItems?: OrderItem[];
  buyer?: {
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

