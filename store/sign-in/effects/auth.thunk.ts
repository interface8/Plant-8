// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { authService } from "../core/services/auth.services";
// import type { SignInPayload, SignUpPayload } from "../core/models/auth.models";

// export const signInThunk = createAsyncThunk(
//   "auth/signIn",
//   async (payload: SignInPayload, { rejectWithValue }) => {
//     try {
//       const data = await authService.signIn(payload);
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to sign in");
//     }
//   }
// );

// export const signUpThunk = createAsyncThunk(
//   "auth/signUp",
//   async (payload: SignUpPayload, { rejectWithValue }) => {
//     try {
//       const data = await authService.signUp(payload);
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to sign up");
//     }
//   }
// );

// export const signOutThunk = createAsyncThunk(
//   "auth/signOut",
//   async (_, { rejectWithValue }) => {
//     try {
//       await fetch("/api/auth/signout", {
//         method: "POST",
//         credentials: "include",
//       });
//       return {};
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to sign out");
//     }
//   }
// );

// export const checkAuthThunk = createAsyncThunk(
//   "auth/checkAuth",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await authService.checkAuth();
//       return data;
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to check auth");
//     }
//   }
// );
// // export const signInThunk = createAsyncThunk(
// //   "auth/signIn",
// //   async (payload: SignInPayload, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch("/api/auth/signin", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         return rejectWithValue(data.error || "Failed to sign in");
// //       }

// //       return data;
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || "Failed to sign in");
// //     }
// //   }
// // );

// // export const signUpThunk = createAsyncThunk(
// //   "auth/signUp",
// //   async (payload: SignUpPayload, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch("/api/auth/signup", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(payload),
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         return rejectWithValue(data.error || "Failed to sign up");
// //       }

// //       return data;
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || "Failed to sign up");
// //     }
// //   }
// // );

// // export const signOutThunk = createAsyncThunk(
// //   "auth/signOut",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       await fetch("/api/auth/signout", {
// //         method: "POST",
// //       });
// //       return {};
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || "Failed to sign out");
// //     }
// //   }
// // );

// // export const checkAuthThunk = createAsyncThunk(
// //   "auth/checkAuth",
// //   async (_, { rejectWithValue }) => {
// //     try {
// //       const response = await fetch("/api/auth/me");

// //       if (!response.ok) {
// //         return rejectWithValue("Not authenticated");
// //       }

// //       const data = await response.json();
// //       return data;
// //     } catch (error: any) {
// //       return rejectWithValue(error.message || "Failed to check auth");
// //     }
// //   }
// // );
