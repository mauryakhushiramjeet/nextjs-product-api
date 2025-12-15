import User, { signupType } from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";

export async function POST(req: NextRequest) {
  try {
    const { password, email } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "password are required" },
        { status: 400 }
      );
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return NextResponse.json(
        { success: false, message: "User not found with this email" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    userExist.password = hashedPassword;
    await userExist.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
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
