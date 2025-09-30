import { axiosInstance } from "@/axios/axiosInstance";
import { ProductType } from "@/lib/models/ProductModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Types } from "mongoose";

export interface GetOrderDetailsTypes {
  _id?: string;
  userId?: {
    _id: Types.ObjectId;
    name: string;
    email: string;
  };
  addressId?: {
    _id: Types.ObjectId;
    address: string;
    addressType: string;
    city: string;
    country: string;
    phone: string;
    state: string;
  };
  status?: string;
  totalAmount: number;
  paymentMethod: string;
  items: [
    {
      product: {
        productId: {
          image: string;
        };
        productName: string;
        image: string;
      };
      quantity: number;
      price: number;
    }
  ];
  addressDetails: {
    addressDetails: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    addressType: string;
  };
}
export const getOrderDetailes = createAsyncThunk(
  "get/orderDetailes",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const getOrderData = await axiosInstance.get(
        `/getOrderDetails/${orderId}`
      );
      const response = await getOrderData.data;
      console.log("orderDetails", response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface initialStateType {
  isLoading: boolean;
  isError: boolean;
  getOrderDetails: GetOrderDetailsTypes | null;
}
const initialState: initialStateType = {
  isLoading: false,
  isError: false,
  getOrderDetails: null,
};
const getOrderDetailsByOrderIdSlice = createSlice({
  name: "getOrderbyOrderId",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(getOrderDetailes.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getOrderDetailes.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.getOrderDetails = action.payload.order;
      })
      .addCase(getOrderDetailes.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default getOrderDetailsByOrderIdSlice.reducer;
