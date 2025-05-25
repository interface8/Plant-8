import { createAction } from "@reduxjs/toolkit";
import type {
  SignInPayload,
  SignUpPayload,
  User,
} from "../core/models/auth.models";

export const signInRequest = createAction<SignInPayload>("auth/signInRequest");
export const signInSuccess = createAction<{ user: User }>("auth/signInSuccess");
export const signInFailure = createAction<string>("auth/signInFailure");

export const signUpRequest = createAction<SignUpPayload>("auth/signUpRequest");
export const signUpSuccess = createAction<User>("auth/signUpSuccess");
export const signUpFailure = createAction<string>("auth/signUpFailure");

export const signOut = createAction("auth/signOut");

// New actions for checking auth status
export const checkAuthSuccess = createAction<{ user: User }>(
  "auth/checkAuthSuccess"
);
export const checkAuthFailure = createAction("auth/checkAuthFailure");
