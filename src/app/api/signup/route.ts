import { databaseConnection } from "@/lib/dbConfig";
import User, { signupType } from "@/lib/models/UserModel";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import generateOtp from "@/utils/generateOtp";
import  verifyEmail from "@/utils/mailServices/verifyEmail";
export async function POST(req: NextRequest) {
  const { email, name, password } = await req.json();
  try {
    databaseConnection();
    if (!name || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "Please fill all the field",
      });
    }
    const isUserAlready = await User.findOne({ email });
    if (isUserAlready) {
      return NextResponse.json({
        success: false,
        message: "User already exist",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000).toString();
    const otp = generateOtp().toString();
    const hashOtp = await bcrypt.hash(otp, 10);
    console.log("HashOtp is here ", hashOtp);
    const userData: signupType = {
      name,
      password: hashPassword,
      email,
      role: "user",
      otp: hashOtp,
      otpExpiry: otpExpiry,
    } as signupType;

    const user = new User(userData);

    await user.save();
    console.log(user);
    const to = email;
    await verifyEmail(to, otp);
    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    let message = "Something went wrong";

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json({ success: false, message });
  }
}
