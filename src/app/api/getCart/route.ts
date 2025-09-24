import { databaseConnection } from "@/lib/dbConfig";
import Cart from "@/lib/models/CartModel";
import { verifyToken } from "../../../lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await databaseConnection();
    const { id } = await verifyToken(req);
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "User id required",
      });
    }
    const userInCart = await Cart.find({userId:id});
    if (!userInCart) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
    }
    return NextResponse.json({ success: true, data: userInCart });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
