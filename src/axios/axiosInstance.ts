import axios from "axios";
import { cookies } from "next/headers";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;
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
