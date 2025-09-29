import { databaseConnection } from "@/lib/dbConfig";
import Order, { OrderType } from "@/lib/models/OrderModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await databaseConnection();
    const { role, id } = await verifyToken(req);
    console.log(role, id);
    let orderDetails: OrderType[];
    if (role === "admin") {
      orderDetails = await Order.find();
    } else {
      orderDetails = await Order.find({ userId: id });
    }
    return NextResponse.json({
      success: true,
      message: "OrderGated successfully",
      orderDetails,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
