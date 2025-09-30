"use client";
import Link from "next/link";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RoleContext } from "../../../lib/contex/roleContext";
import { useFormik } from "formik";
import { loginValodationSchema } from "@/utils/schema/authSchema";
import { useAppDispatch } from "@/store/store";
import { loginUser } from "@/store/loginSlice";
const LoginPage = () => {
  const router = useRouter();
  const { setRole } = useContext(RoleContext);
  const dispatch = useAppDispatch();


  const initialValues = {
    email: "",
    password: "",
  };
  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema: loginValodationSchema,
      onSubmit: (value, action) => {
        dispatch(loginUser(value)).then((res) => {
          console.log(res);
          if (res.payload.success) {
            toast.success(res.payload.message);
            localStorage.setItem("role", res.payload.data.role);
            setRole(res.payload.data.role);
            const role = res.payload.data.role;
            localStorage.setItem("userId",res.payload.data.id)
            if (role === "admin") router.push("/admin/dashboard");
            if (role === "user") router.push("/");
            action.resetForm();
          } else {
            toast.error(res.payload.message);
          }
        });
      },
    });

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
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
              required
            />
            {touched.email && errors.email && (
              <p className="text-red-800 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
              required
            />
            {touched.password && errors.password && (
              <p className="text-red-800 text-sm">{errors.password}</p>
            )}
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
