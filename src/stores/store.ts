import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import employeeReducer from "./slices/employeeSlice";

const reducer = {
  productReducer,
  authReducer,
  employeeReducer,
};

export const store = configureStore({
  reducer,
  devTools: import.meta.env.VITE_MODE === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// export type of root state from reducers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
