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
    // console.log(user._id);
    const token = await createToken(user._id, user.role);
    // console.log(token);
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
    response.cookies.set({ name: "token", value: token });
    return response;
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong in signup",
    });
  }
}
