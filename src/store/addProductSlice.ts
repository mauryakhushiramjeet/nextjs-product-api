import { axiosInstance } from "@/axios/axiosInstance";
import { ProductType } from "@/lib/models/ProductModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface initialStateType {
  loading: boolean;
  isError: boolean;
  data: ProductType | null;
}
const initialState: initialStateType = {
  loading: false,
  isError: false,
  data: null,
};
export const addProduct = createAsyncThunk(
  "add/product",
  async (Product, { rejectWithValue }) => {
    try {
      const addData = await axiosInstance.post("/addproduct", Product);
      const response = await addData.data;
      console.log("add product data from slice", response);
      return response;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const addProductSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(addProduct.pending, (state) => {
        state.isError = false;
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isError = false;
        state.loading = true;
      })
      .addCase(addProduct.rejected, (state) => {
        state.isError = true;
        state.loading = false;
      });
  },
});
export default addProductSlice.reducer;
