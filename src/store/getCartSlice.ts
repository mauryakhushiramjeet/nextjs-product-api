import { axiosInstance } from "@/axios/axiosInstance";
import { CartSchemaInitial, CartSchemaType } from "@/lib/models/CartModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCartByUserId = createAsyncThunk(
  "/getcart",
  async (_, { rejectWithValue }) => {
    try {
      const getCartData = await axiosInstance.get("/getCart");
      const response = await getCartData.data.data;
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
interface CartState {
  isLoading: boolean;
  isError: boolean;
  cartData: CartSchemaType []|null;
}

const initialState: CartState = {
  isLoading: false,
  isError: false,
  cartData: null,
};

const cartSlice = createSlice({
  name: "getCartData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCartByUserId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCartByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.cartData = action.payload; 
      })
      .addCase(getCartByUserId.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default cartSlice.reducer;
