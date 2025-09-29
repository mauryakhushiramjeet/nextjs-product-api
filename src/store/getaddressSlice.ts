import { axiosInstance } from "@/axios/axiosInstance";
import { addressType } from "@/lib/models/AddressModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getAddressById = createAsyncThunk(
  "get/address",
  async (_, { rejectWithValue }) => {
    try {
      const addAddress = await axiosInstance.get("/getAddressById");
      const response = await addAddress?.data?.userAddress;
      console.log(response.userAddress);
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
const getAddressSlic = createSlice({
  name: "getAddressById",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(getAddressById.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getAddressById.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.addressDetails = action.payload;
      })
      .addCase(getAddressById.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default getAddressSlic.reducer;
