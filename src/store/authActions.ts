import { axiosInstance } from "@/axios/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
interface VerifyEmailData {
  email: string;
  otp: string;
}

export const verifyEmailOtp = createAsyncThunk(
  "auth/verifyEmail",
  async (data: VerifyEmailData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/verifyEmail", data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const resendEmailOtp = createAsyncThunk(
  "auth/resendEmailOtp",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/resend-Otp", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/forgot-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/reset-password", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
