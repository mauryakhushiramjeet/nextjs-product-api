import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const productDeleteById = createAsyncThunk(
  "delete/product",
  async (id: string, { rejectWithValue }) => {
    try {
      const deleteProduct = await axiosInstance.delete(
        `/deleteProductById/${id}`
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
const deleteProductByIdSlice = createSlice({
  name: "deleteProductId",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(productDeleteById.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(productDeleteById.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(productDeleteById.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default deleteProductByIdSlice.reducer
