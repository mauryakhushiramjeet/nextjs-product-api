import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getCategory = createAsyncThunk(
  "get/category",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getAllCategory");
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export interface CategoryType {
  _id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface initialStateType {
  isError: boolean;
  isLoading: boolean;
  category: CategoryType[] | null;
}
const initialState: initialStateType = {
  isError: false,
  isLoading: false,
  category: null,
};
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(getCategory.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(getCategory.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default categorySlice.reducer;
