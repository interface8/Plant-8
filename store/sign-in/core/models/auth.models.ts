export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
  roles?: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
