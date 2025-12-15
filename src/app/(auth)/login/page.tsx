"use client";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RoleContext } from "../../../lib/contex/roleContext";
import { useFormik } from "formik";
import { loginValodationSchema } from "@/utils/schema/authSchema";
import { useAppDispatch } from "@/store/store";
import { loginUser } from "@/store/loginSlice";
import { TbLoader3 } from "react-icons/tb";
import { resendEmailOtp, verifyEmailOtp } from "@/store/authActions";

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setRole } = useContext(RoleContext);

  const [loading, setLoading] = useState(false);

  const initialValues = { email: "", password: "" };

  const { handleBlur, handleChange, handleSubmit, errors, touched, values } =
    useFormik({
      initialValues,
      validationSchema: loginValodationSchema,
      onSubmit: (value, action) => {
        setLoading(true);

        dispatch(loginUser(value)).unwrap().then((res) => {
          console.log(res)
          setLoading(false);

          if (res.success) {
            toast.success(res.message);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("userId", res.data.id);

            setRole(res.data.role);
            if (res.data.role === "admin")
              router.push("/admin/dashboard");
            if (res.data.role === "user") router.push("/");

            action.resetForm();
          } else {
            toast.error(res.message);
              console.log(res.message)
          setErrorMessage(res.message);
          }
        });
      },
    });
  const handleResendOtp = async () => {
    const email = localStorage.getItem("email");
    if (!email) return;
    dispatch(resendEmailOtp({ email }))
      .unwrap()
      .then((res) => {
        if (res.success) {
          toast.success(res.message);
          router.push("/verifyOtp");
        } else {
          toast.error(res.message);
        
        }
      });
  };
  console.log(errorMessage)
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
            />
            {touched.password && errors.password && (
              <p className="text-red-800 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#154D71] text-white py-2 rounded-lg cursor-pointer hover:bg-[#1C6EA4] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-full flex items-center justify-center">
                <p className="animate-spin text-white">
                  <TbLoader3 />
                </p>
              </div>
            ) : (
              "Login"
            )}
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
        {errorMessage === "Password not matched" && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Forgot your password?{" "}
            <Link
              href="/forgot-password"
              className="text-[#154D71] font-medium hover:text-[#1C6EA4] hover:underline transition"
            >
              Reset here
            </Link>
          </p>
        )}

        {errorMessage === "Email is not verified" && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Your email is not verified.{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#154D71] font-medium hover:text-[#1C6EA4] hover:underline transition"
            >
              Resend verification email
            </button>
          </p>
        )}

        {/* <p className="mt-4 text-center text-sm text-gray-600">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#154D71] cursor-pointer font-medium hover:text-[#1C6EA4] hover:underline transition"
            >
              Resend verification email
            </button>
          </p> */}
      </div>
    </div>
  );
};

export default LoginPage;
