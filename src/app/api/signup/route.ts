import { databaseConnection } from "@/lib/dbConfig";
import User, { signupType } from "@/lib/models/UserModel";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

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
    const userData: signupType = {
      name,
      password: hashPassword,
      email,
      role: "user",
    } as signupType;
    const user = new User(userData);
    await user.save();
    console.log(user);

    return NextResponse.json({
      success: true,
      message: "user signup successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong in signup",
    });
  }
}
