import User from "@/lib/models/UserModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createToken } from "../../../lib/tokenmanage/creteToken";
import { databaseConnection } from "@/lib/dbConfig";
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    databaseConnection();
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        mesasage: "Please fill all the field",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "user not exist with this email.",
      });
    }
    const validatePassword = await bcrypt.compare(password, user.password);
    if (!validatePassword) {
      return NextResponse.json({
        success: false,
        message: "Password not matched",
      });
    }
    const token = await createToken(user._id, user.role);

    const response = NextResponse.json({
      success: true,
      message: "User login successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
    response.cookies.set({ name: "token", value: token, maxAge: 2*24* 60 * 60 });
    return response;
  }catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
