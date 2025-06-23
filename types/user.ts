export interface UserType {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  token?: string;
}

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
