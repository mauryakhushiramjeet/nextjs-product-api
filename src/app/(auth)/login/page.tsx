"use client";
import axios from "axios";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RoleContext } from "../../../lib/contex/roleContext";
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const { setRole } = useContext(RoleContext);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userLogin = await axios.post(
        "http://localhost:3000/api/login",
        formData
      );
      const response = await userLogin.data;
      // console.log(response);
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("role", response.data.role);
        setRole(response.data.role);
        localStorage.setItem("userId", response.data.id);
        const role = response.data.role;
        console.log(role);
        if (role === "admin") router.push("/admin/dashboard");
        else if (role === "user") router.push("/");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#154D71] text-white py-2 rounded-lg cursor-pointer hover:bg-[#1C6EA4] transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#154D71] font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
