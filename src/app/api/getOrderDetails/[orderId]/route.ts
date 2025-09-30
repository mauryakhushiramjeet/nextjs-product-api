import { databaseConnection } from "@/lib/dbConfig";
import Product from "@/lib/models/ProductModel";
import Address from "@/lib/models/AddressModel";
import User from "@/lib/models/UserModel";
import Order from "@/lib/models/OrderModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
): Promise<NextResponse> {
  const { orderId } = params;

  try {
    await databaseConnection();
    await verifyToken(req);

    const order = await Order.findById(orderId)
      .populate("userId", "name email",User)
      .populate("addressId", "phone address city state country addressType",Address)
    .populate("items.product.productId", "image",Product)

    return NextResponse.json({
      success: true,
      message: "OrderDetails retrieved successfully",
      order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
