import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const deleteCartByUserId = createAsyncThunk(
  "delete/cart",
  async (id: string, { rejectWithValue }) => {
    try {
      const deleteProduct = await axiosInstance.delete(
        `/deleteCartByUserId/${id}`
      );
      const response = await deleteProduct.data;
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
interface initialStateType {
  isLoading: boolean;
  isError: boolean;
}
const initialState: initialStateType = {
  isLoading: false,
  isError: false,
};
const deleteCartByUserIdSlice = createSlice({
  name: "deletecart",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(deleteCartByUserId.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(deleteCartByUserId.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(deleteCartByUserId.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default deleteCartByUserIdSlice.reducer;
