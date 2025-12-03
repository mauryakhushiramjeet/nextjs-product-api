import { axiosInstance } from "@/axios/axiosInstance";
import { ProductViewType } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  available: boolean;
  bestSeller: boolean;
}
interface initialSateShap {
  loading: boolean;
  isError: boolean;
  data: ProductViewType | null;
}
const initialState: initialSateShap = {
  loading: false,
  isError: false,
  data: null,
};
export const getProductById = createAsyncThunk(
  "get/productById",
  async (id:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/productbyid/${id}`);
      const data = await response.data.product
      return data;

    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
const getProductByIdSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductById.pending, (state) => {
        state.isError = false;
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isError = false;
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProductById.rejected, (state) => {
        state.isError = true;
        state.loading = false;
      });
  },
});
export default getProductByIdSlice.reducer
