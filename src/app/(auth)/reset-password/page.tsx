"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TbLoader3 } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { resetPassword } from "@/store/authActions";
// import { resetPassword } from "@/store/signupSlice"; // add thunk later

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // 1️⃣ Yup validation schema
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  // 2️⃣ Formik setup
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, actions) => {
         try {
           setLoading(true);
           const password=values.password
           const email=localStorage.getItem("email")
           if(!email) return
           dispatch(resetPassword({password,email}))
             .unwrap()
             .then((res) => {
               setLoading(false);
               if (res.success) {
                 toast.success(res.message);
                 actions.resetForm();
                 router.push("/login");
               } else {
                 toast.error(res.message);
                 console.log(res.message);
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
          Reset Password
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Create a new password for your account.
        </p>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-700 text-sm">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-[#3185b9] rounded-lg focus:outline-none text-sm"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-700 text-sm">
                  {formik.errors.confirmPassword}
                </p>
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
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center text-sm mt-4">
          Back to{" "}
          <a
            href="/login"
            className="text-[#154D71] font-medium hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
