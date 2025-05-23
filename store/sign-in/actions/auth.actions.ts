import { createAction } from "@reduxjs/toolkit";
import { SignInPayload, SignUpPayload } from "../core/models/auth.models";

export const signInRequest = createAction<SignInPayload>("auth/signInRequest");
export const signInSuccess = createAction<{
  user: { id: string; email: string; name: string; roles: string[] };
  token: string;
}>("auth/signInSuccess");
export const signInFailure = createAction<string>("auth/signInFailure");

export const signUpRequest = createAction<SignUpPayload>("auth/signUpRequest");
export const signUpSuccess = createAction<{
  id: string;
  email: string;
  name: string;
  roles: string[];
}>("auth/signUpSuccess");
export const signUpFailure = createAction<string>("auth/signUpFailure");
export const signOut = createAction("auth/signOut");
