import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateProductId = createAsyncThunk(
  "update/product",
  async ({id,formData}:{id:string,formData:FormData}, { rejectWithValue }) => {
    try {
      const upadteproduct = await axiosInstance.put(`/updatebyid/${id}`,formData, {
        headers: {
          "Content-Type": "form-data",
        },
      });
      const response = await upadteproduct.data;
      console.log("updated product response", id,formData);
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
const updateProductSlice = createSlice({
  name: "updatedProduct",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(updateProductId.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(updateProductId.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(updateProductId.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default updateProductSlice.reducer;
