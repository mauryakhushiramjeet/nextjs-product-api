import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SignupDataType {
  name: string;
  email: string;
  password: string;
}

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupDataType, { rejectWithValue }) => {
    try {
      const signupResponse = await axiosInstance.post("/signup", data);
      const response = signupResponse.data;
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



// State type
interface SignupStateType {
  isLoading: boolean;
  isError: boolean;
}

// Initial state
const initialState: SignupStateType = {
  isLoading: false,
  isError: false,
};

// Slice
const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export default signupSlice.reducer;
