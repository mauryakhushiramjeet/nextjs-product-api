import { axiosInstance } from "@/axios/axiosInstance";
import { addressType } from "@/lib/models/AddressModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const orderProdductByAddress = createAsyncThunk(
  "add/address",
  async (data: addressType, { rejectWithValue }) => {
    try {
      const addAddress = await axiosInstance.post("/address", data);
      const response = await addAddress.data;
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
interface initialStateType {
  isLoading: boolean;
  isError: boolean;
  addressDetails: addressType[] | null;
}
const initialState: initialStateType = {
  isLoading: false,
  isError: false,
  addressDetails: null,
};
const addressSlice = createSlice({
  name: "orderByAddress",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(orderProdductByAddress.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(orderProdductByAddress.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.addressDetails = action.payload;
      })
      .addCase(orderProdductByAddress.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default addressSlice.reducer;
