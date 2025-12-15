import User from "@/lib/models/UserModel";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  try {
    if (!otp) {
      return NextResponse.json(
        { success: false, message: "OTP is required." },
        { status: 400 }
      );
    }

    // 2. Find the user by email
    const user = await User.findOneAndUpdate({ email },{isVerified:true});
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User with this email does not exist." },
        { status: 404 }
      );
    }

    // 3. Check if OTP has expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    // 4. Validate OTP
    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // 5. Successful verification
    return NextResponse.json(
      {
        success: true,
        message: "OTP verified successfully.",
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
