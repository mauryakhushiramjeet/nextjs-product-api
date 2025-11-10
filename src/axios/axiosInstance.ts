"use client";
import axios from "axios";
import Cookies from "js-cookie";
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials:true
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");
    console.log("token is here ", token);
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
