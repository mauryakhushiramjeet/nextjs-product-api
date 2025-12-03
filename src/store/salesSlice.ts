import { axiosInstance } from "@/axios/axiosInstance";
import { SaleInterface } from "@/lib/models/SaleModel";
import { SaleViewInterface } from "@/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
interface initialStateType {
  loading: boolean;
  isError: boolean;
  data: SaleViewInterface[] | null;
}
const initialState: initialStateType = {
  loading: false,
  isError: false,
  data: null,
};

export const deteleSale = createAsyncThunk(
  "delete/sales",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete("/deleteSale");

      return await response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSales = createAsyncThunk(
  "create/sale",
  async (data: FormData, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.post(`/createSale`, data, {
        headers: {
          "Content-Type": "form-data",
        },
      });
      console.log(response.data, "created sale log in");
      return await response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const deleteSale = createAsyncThunk(
  "delete/sale",
  async (id: string, { rejectWithValue }) => {
    try {
      if (!id) throw new Error("ID is required");
      const response = await axiosInstance.delete(`/deleteSale/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);
export const getSalesDetailes = createAsyncThunk(
  "get/salesDetailes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/getSaleDetails");
      // console.log(response.data.sales, "in response of function");
      return response.data.sales;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const salesSlice = createSlice({
  name: "addProduct",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(getSalesDetailes.pending, (state) => {
        state.isError = false;
        state.loading = true;
      })
      .addCase(getSalesDetailes.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isError = false;
        state.loading = false;
      })
      .addCase(getSalesDetailes.rejected, (state) => {
        state.isError = true;
        state.loading = false;
      });
  },
});
export default salesSlice.reducer;
