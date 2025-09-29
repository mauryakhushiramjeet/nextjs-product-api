import { axiosInstance } from "@/axios/axiosInstance";
import { ProductType } from "@/lib/models/ProductModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface GetOrderDetailsTypes {
  _id?: string;
  userId?: string;
  addressId?: string;
  status?: string;
  totalAmount: number;
  items: [
    {
      product: { productId: string; productName: string };
      quantity: number;
      price: number;
      productDetails: ProductType;
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
  userDetails: {
    email: string;
  };
}
export const getOrderDetailes = createAsyncThunk(
  "get/orderDetailes",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const getOrderData = await axiosInstance.get(`/order/${orderId}`);
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
  getOrderDetails: GetOrderDetailsTypes[] | null;
}
const initialState: initialStateType = {
  isLoading: false,
  isError: false,
  getOrderDetails: null,
};
const getOrderDetailsByOrderIdSlice = createSlice({
  name: "getOrder",
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
        state.getOrderDetails = action.payload;
      })
      .addCase(getOrderDetailes.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default getOrderDetailsByOrderIdSlice.reducer;
