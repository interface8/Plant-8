import { createReducer } from "@reduxjs/toolkit";
import { AuthState } from "../core/models/auth.models";
import {
  signInRequest,
  signInSuccess,
  signInFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  signOut,
} from "../actions/auth.actions";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(signInRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signInSuccess, (state, action) => {
      state.loading = false;
      state.user = { ...action.payload.user, token: action.payload.token };
    })
    .addCase(signInFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(signUpRequest, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(signUpSuccess, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    })
    .addCase(signUpFailure, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(signOut, (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
    });
});
