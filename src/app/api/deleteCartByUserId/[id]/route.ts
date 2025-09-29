import { databaseConnection } from "@/lib/dbConfig";
import Cart from "@/lib/models/CartModel";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  const { id } =params;
  console.log("here is uder id", id);
  try {
    await databaseConnection();
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Id is not available",
      });
    }
    const deletedCartData = await Cart.deleteMany({ userId: id });
    if (!deletedCartData) {
      return NextResponse.json({
        success: false,
        message: "Cart is not available",
      });
    }
    return NextResponse.json({ success: true, message: " successfully" });
  } catch (error: any) {
    console.log();
    return NextResponse.json({ success: false, message: error.message });
  }
}
