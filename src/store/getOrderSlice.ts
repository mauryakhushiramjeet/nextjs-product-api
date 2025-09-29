import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderType } from "../lib/models/OrderModel";
import { axiosInstance } from "@/axios/axiosInstance";

export const getOrder = createAsyncThunk(
  "getOrder/order",
  async (_, { rejectWithValue }) => {
    try {
      const postOrder = await axiosInstance.get("/getOrder");
      const response = await postOrder.data.orderDetails;
      // console.log(response);
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
interface InitialStateType {
  isError: boolean;
  isLoading: boolean;
  orderData: OrderType[] | null;
}
const initialState: InitialStateType = {
  isError: false,
  isLoading: false,
  orderData: null,
};
const getOrderSlice = createSlice({
  name: "getOrderDetails",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(getOrder.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(getOrder.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default getOrderSlice.reducer;
