"use client";
import { configureStore } from "@reduxjs/toolkit";
import allProductReducer from "./getProductSlice";
import singleProduct from "./getProductByIdSlice";
import addProduct from "./addProductSlice";
import deleteProductByIdReducer from "./deleteProductByIdSlice";
import updatedProductReducer from "./updateProductSlice";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
  reducer: {
    products: allProductReducer,
    Product: singleProduct,
    addProduct: addProduct,
    deleteProductId: deleteProductByIdReducer,
    updatedProduct: updatedProductReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
