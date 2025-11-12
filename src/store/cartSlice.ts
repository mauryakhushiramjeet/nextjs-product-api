import { cartDataType } from "@/app/(main)/user/product/[id]/page";
import { axiosInstance } from "@/axios/axiosInstance";
import { CartSchemaType } from "@/lib/models/CartModel";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const addProductInCart = createAsyncThunk(
  "/addcart",
  async (data: cartDataType, { rejectWithValue }) => {
    try {
      console.log(data);
      const addcart = await axiosInstance.post("/cart", data);
      const response = await addcart.data;
      // console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
interface initialStateType {
  isLoading: boolean;
  isError: boolean;
  cartData: CartSchemaType[] | null;
}
const initialState: initialStateType = {
  isError: false,
  isLoading: false,
  cartData: null,
};
const cartSlice = createSlice({
  name: "cartData",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(addProductInCart.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(addProductInCart.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
        state.cartData = action.payload;
      })
      .addCase(addProductInCart.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default cartSlice.reducer;
