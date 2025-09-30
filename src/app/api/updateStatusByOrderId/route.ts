import { databaseConnection } from "@/lib/dbConfig";
import Order from "@/lib/models/OrderModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  try {
    await databaseConnection();
    await verifyToken(req);
    if (!id) {
      return NextResponse.json({ success: false, message: "Id not found." });
    }
    if (!status) {
      return NextResponse.json({
        success: false,
        message: "Status is required",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedOrder) {
      return NextResponse.json({
        success: false,
        message: "Order not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      order: updatedOrder,
    });
  }catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
