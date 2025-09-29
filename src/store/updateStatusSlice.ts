import { OrderStatusType } from "@/app/admin/order/page";
import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export  const UpdateStatusById = createAsyncThunk(
  "update/status",
  async (data: OrderStatusType, { rejectWithValue }) => {
    try {
      const updateStatus = await axiosInstance.put(
        "/updateStatusByOrderId",
        data
      );
      const response = updateStatus.data;
    //   console.log(response);
      return response;
    } catch (error) {
      console.log(error);
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
const updateStatusByOrderId = createSlice({
  name: "updatedStatus",
  initialState,
  reducers: {},
  extraReducers: (building) => {
    building
      .addCase(UpdateStatusById.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(UpdateStatusById.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(UpdateStatusById.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});
export default updateStatusByOrderId.reducer;
