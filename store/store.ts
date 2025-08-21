import { configureStore } from "@reduxjs/toolkit";

import investmentReducer from "./slices/investmentSlice";
import investmentStepReducer from "./slices/investmentStepSlice";

export const store = configureStore({
  reducer: {
    investment: investmentReducer,
    investmentStep: investmentStepReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// import { configureStore } from "@reduxjs/toolkit";
// import { authReducer } from "./sign-in/reducers/auth.reducer";
// import {
//   type TypedUseSelectorHook,
//   useDispatch,
//   useSelector,
// } from "react-redux";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//   },
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
