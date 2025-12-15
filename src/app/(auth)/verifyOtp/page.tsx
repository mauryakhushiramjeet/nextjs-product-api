"use client";

import { useFormik } from "formik";
import { otpValidation } from "@/utils/schema/authSchema";
import { useAppDispatch } from "@/store/store";
// import { verifyOtp } from "@/store/signupSlice"; // your OTP API
import { resendEmailOtp, verifyEmailOtp } from "@/store/authActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import React from "react";

const VerifyOtpPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: { otp: "" },
      validationSchema: otpValidation,
      onSubmit: (value) => {
        setIsLoading(true);
        const email = localStorage.getItem("email");
        if (!email) return;
        dispatch(verifyEmailOtp({ otp: value.otp, email: email }))
          .unwrap()
          .then((res) => {
            setIsLoading(false);

            if (res.success) {
              toast.success(res.message);
              const purpose = localStorage.getItem("perpose"); 
              if (purpose && purpose === "forgetPasswordPerpose") {
                router.push("/reset-password");
              } else {
                router.push("/login");
              }
            } else {
              toast.error(res.message);
            }
          })
          .catch(() => setIsLoading(false));
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
          router.push("/login");
        } else {
          toast.error(res.message);
        }
      });
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-2 text-[#154D71]">
          Verify OTP
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Enter the 6-digit OTP sent to your email
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">OTP Code</label>

            <input
              type="text"
              name="otp"
              maxLength={6}
              value={values.otp}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 text-center tracking-widest border border-[#3185b9] rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#3185b9]"
            />

            {touched.otp && errors.otp && (
              <p className="text-red-800 text-sm mt-1">{errors.otp}</p>
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
              "Verify OTP"
            )}
          </button>
          <p className="mt-4 text-center text-sm text-gray-600">
            Didn’t receive the email?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-[#154D71] cursor-pointer font-medium hover:text-[#1C6EA4] hover:underline transition"
            >
              Resend verification email
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
