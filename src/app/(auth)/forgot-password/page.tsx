"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TbLoader3 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/store/authActions";
import { useAppDispatch } from "@/store/store";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const router = useRouter();

  // 1️⃣ Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email address")
      .required("Email is required"),
  });

  // 2️⃣ Formik setup
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        setLoading(true);
        dispatch(forgotPassword(values))
          .unwrap()
          .then((res) => {
            setLoading(false);
            if (res.success) {
              toast.success(res.message);
              actions.resetForm();
               localStorage.setItem("perpose","forgetPasswordPerpose"); // "emailVerification" or "resetPassword"

              router.push("/verifyOtp");
            } else {
              toast.error(res.message);
              console.log(res.message);
              setLoading(false);
            }
          });
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#154D71] mb-2">
          Forgot Password
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your email and we’ll send you a password reset link.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-700 text-sm">{formik.errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-[#154D71] text-white py-2 rounded-lg hover:bg-[#1C6EA4] transition disabled:opacity-60"
          >
            {loading ? (
              <span className="animate-spin">
                <TbLoader3 size={20} />
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm mt-4">
          Remember your password?{" "}
          <a
            href="/login"
            className="text-[#154D71] font-medium hover:underline"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
