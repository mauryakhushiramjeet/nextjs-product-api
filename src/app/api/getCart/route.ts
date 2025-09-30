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
    const userInCart = await Cart.find({ userId: id });
    if (!userInCart || userInCart.length === 0) {
      return NextResponse.json({ success: false, message: "Cart is empty" });
    }
    return NextResponse.json({ success: true, data: userInCart });
  } catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
