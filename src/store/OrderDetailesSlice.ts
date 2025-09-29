import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderType } from "../lib/models/OrderModel";
import { axiosInstance } from "@/axios/axiosInstance";

export const PostOrderDetailes = createAsyncThunk(
  "post/order",
  async (data: OrderType, { rejectWithValue }) => {
    try {
      console.log("data",data)
      const postOrder = await axiosInstance.post("/addOrder", data);
      const response = await postOrder.data;
      console.log(response);
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
  orderData: OrderType | null;
}
const initialState: InitialStateType = {
  isError: false,
  isLoading: false,
  orderData: null,
};
const OrderDetailesSlice = createSlice({
  name: "orderDetailes",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(PostOrderDetailes.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(PostOrderDetailes.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(PostOrderDetailes.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default OrderDetailesSlice.reducer;
