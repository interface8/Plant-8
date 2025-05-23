import { AppThunk } from "@/store/store";
import {
  signInRequest,
  signInSuccess,
  signInFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  signOut,
} from "../actions/auth.actions";
import { authService } from "../core/services/auth.services";
import { SignInPayload, SignUpPayload } from "../core/models/auth.models";

export const signInThunk =
  (payload: SignInPayload): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(signInRequest(payload));
      const { token, user } = await authService.signIn(payload);
      dispatch(signInSuccess({ user, token }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(signInFailure(error.message));
    }
  };

export const signUpThunk =
  (payload: SignUpPayload): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(signUpRequest(payload));
      const user = await authService.signUp(payload);
      dispatch(signUpSuccess(user));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      dispatch(signUpFailure(error.message));
    }
  };

export const signOutThunk = (): AppThunk => async (dispatch) => {
  try {
    localStorage.removeItem("authToken");

    dispatch(signOut());

    window.location.href = "/";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Logout error:", error);
  }
};
