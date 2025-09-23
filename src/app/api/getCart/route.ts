import { databaseConnection } from "@/lib/dbConfig";
import Cart from "@/lib/models/CartModel";
import User from "@/lib/models/UserModel";
import { verifyToken } from "../../../lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
  // { params }: { params: { id: string } }
) {
  // const { userId } = await req.body;
  // const { userId } = await params;
  try {
    await databaseConnection();
    const user = await verifyToken(req);
    console.log(user);
    console.log("user is here", user);
    const { _id } = user;
    const userId = _id;
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "User id required",
      });
    }
    const userExist = await User.findById(userId);
    if (!userExist) {
      return NextResponse.json({ success: false, message: "User not exist" });
    }
    const userInCart = await Cart.find(userId);
    if (!userInCart) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
      return NextResponse.json({ success: true, data: user });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
