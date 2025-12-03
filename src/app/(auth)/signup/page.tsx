"use client";
import { signupUser } from "@/store/signupSlice";
import { useAppDispatch } from "@/store/store";
import { signUpValidation } from "@/utils/schema/authSchema";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const { handleBlur, handleSubmit, handleChange, errors, values, touched } =
    useFormik({
      initialValues,
      validationSchema: signUpValidation,
      onSubmit: (value) => {
        setIsLoading(true);

        dispatch(signupUser(value))
          .then((res) => {
            setIsLoading(false);

            if (res.payload.success) {
              toast.success(res.payload.message);
              router.push("/login");
            } else {
              toast.error(res.payload.message);
            }
          })
          .catch(() => setIsLoading(false));
      },
    });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className="w-full p-2 border border-[#3185b9] rounded-lg text-sm"
            />
            {touched.name && errors.name && (
              <p className="text-red-800 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className="w-full p-2 border border-[#3185b9] rounded-lg text-sm"
            />
            {touched.email && errors.email && (
              <p className="text-red-800 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter password"
              className="w-full p-2 border border-[#3185b9] rounded-lg text-sm"
            />
            {touched.password && errors.password && (
              <p className="text-red-800 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center bg-[#154D71] text-white py-2 rounded-lg cursor-pointer hover:bg-[#1C6EA4] transition disabled:opacity-60"
          >
            {isLoading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#154D71] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
