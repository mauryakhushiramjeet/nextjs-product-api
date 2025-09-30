import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface SignupDataType {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  "auth/signup",
  async (data: SignupDataType, { rejectWithValue }) => {
    try {
      const signupResponse = await axiosInstance.post("/login", data);
      const response = signupResponse.data;
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

interface SignupStateType {
  isLoading: boolean;
  isError: boolean;
}

const initialState: SignupStateType = {
  isLoading: false,
  isError: false,
};

//
const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isError = false;
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.isError = false;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isError = true;
        state.isLoading = false;
      });
  },
});

export default loginSlice.reducer;
