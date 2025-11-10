import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  bestSeller: boolean;
}
export interface ProductResponse {
  message: string;
  limit?: number;
  page?: number;
  totalpages?: number;
  product: ProductType[];
}
interface initialSateShap {
  loading: boolean;
  isError: boolean;
  data: ProductResponse | null;
}
const initialState: initialSateShap = {
  loading: false,
  isError: false,
  data: null,
};
export const getAllProduct = createAsyncThunk(
  "get/product",
  async (
    {
      page,
      category,
      bestSeller,
    }: { page?: number; category?: string; bestSeller?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const getProduct = await axiosInstance.get(
        `/getproduct?page=${page}&category=${category || ""}&bestSeller=${
          bestSeller || ""
        }`
      );
      const response = await getProduct.data;
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
const getAllProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProduct.pending, (state) => {
        state.loading = true;
        state.isError = false;
      })
      .addCase(getAllProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isError = false;
      })
      .addCase(getAllProduct.rejected, (state) => {
        state.loading = false;
        state.isError = true;
      });
  },
});
export default getAllProductSlice.reducer;
