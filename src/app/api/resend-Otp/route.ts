import User from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import generateOtp from "@/utils/generateOtp";
import verifyEmail from "@/utils/mailServices/verifyEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User with this email does not exist." },
        { status: 404 }
      );
    }

    const otp = generateOtp().toString();

    const hashedOtp = await bcrypt.hash(otp, 10);
    user.otp = hashedOtp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();
    const to = email;
    await verifyEmail(to, otp);
    return NextResponse.json(
      {
        success: true,
        message: "A new OTP has been sent to your email.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    let message = "Something went wrong.";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
