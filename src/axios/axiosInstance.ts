"use client"
import axios from "axios";
import Cookies from "js-cookie";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});
axiosInstance.interceptors.request.use(
  async (config) => {
    // const cookieStore = await cookies();

    const token = Cookies.get("token")

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);
