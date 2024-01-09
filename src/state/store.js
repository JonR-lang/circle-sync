import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/index.js";

export const store = configureStore({
  reducer: authReducer,
});
