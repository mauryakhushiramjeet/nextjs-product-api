import User from "@/lib/models/UserModel";
import resetPasswordMail from "@/utils/mailServices/resetPasswordMail";
import generateOtp from "@/utils/generateOtp";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { databaseConnection } from "@/lib/dbConfig";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await databaseConnection();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email does not exist" },
        { status: 404 }
      );
    }

    const otp = generateOtp().toString();

    const hashedOtp = await bcrypt.hash(otp, 10);

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;

    await user.save();
    const to = email;
    await resetPasswordMail(to, otp);

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
        otpForTesting: otp,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
