import { createReducer } from "@reduxjs/toolkit";
import type { AuthState } from "../core/models/auth.models";
import {
  signInRequest,
  signInSuccess,
  signInFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  signOut,
  checkAuthSuccess,
  checkAuthFailure,
} from "../actions/auth.actions";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(signInRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signInSuccess, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(signInFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase(signUpRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signUpSuccess, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    })
    .addCase(signUpFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })
    .addCase(signOut, (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.isAuthenticated = false;
    })
    .addCase(checkAuthSuccess, (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    })
    .addCase(checkAuthFailure, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    });
});
