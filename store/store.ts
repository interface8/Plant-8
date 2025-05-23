import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { authReducer } from "./sign-in/reducers/auth.reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  authPersistenceMiddleware,
  loadAuthState,
} from "./middleware/auth-percistence";

const preloadedState = {
  auth: loadAuthState() || { user: null, loading: false, error: null },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authPersistenceMiddleware),
  preloadedState,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
