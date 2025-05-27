// import { SignInPayload, SignUpPayload } from "../models/auth.models";

// export const authService = {
//   signIn: async ({
//     email,
//     password,
//   }: SignInPayload): Promise<{
//     token: string;
//     user: { id: string; email: string; name: string; roles: string[] };
//   }> => {
//     const response = await fetch("/api/auth/signin", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, password }),
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const { message } = await response.json();
//       throw new Error(message || "Failed to sign in");
//     }

//     return response.json();
//   },

//   signUp: async ({
//     name,
//     email,
//     password,
//     confirmPassword,
//   }: SignUpPayload): Promise<{
//     id: string;
//     email: string;
//     name: string;
//     roles: string[];
//   }> => {
//     const response = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ name, email, password, confirmPassword }),
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const { error } = await response.json();
//       throw new Error(error || "Failed to sign up");
//     }

//     return response.json();
//   },

//   checkAuth: async (): Promise<{
//     user: { id: string; email: string; name: string; roles: string[] };
//   }> => {
//     const response = await fetch("/api/auth/me", {
//       method: "GET",
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const { error } = await response.json();
//       throw new Error(error || "Failed to check auth");
//     }

//     return response.json();
//   },
// };
