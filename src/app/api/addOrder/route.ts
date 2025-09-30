import { databaseConnection } from "@/lib/dbConfig";
import Order, { OrderItem, OrderType } from "@/lib/models/OrderModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const { addressId, totalAmount, items, paymentMethod } = await req.json();

  try {
    await databaseConnection();
    const tokenData = await verifyToken(req);

    // Assert that id is a string
    const id = tokenData.id as string;
    const userId = new mongoose.Types.ObjectId(id);
    console.log(addressId, totalAmount, items);
    if (!addressId || !totalAmount || !items || items.length === 0) {
      return NextResponse.json({
        success: false,
        message: "All filed is required",
      });
    }
    const formatedItems = items.map((item: OrderItem) => {
      const { product, quantity, price } = item;
      return {
        product: {
          productId: new mongoose.Types.ObjectId(product.productId),
          productName: product.productName,
        },
        quantity,
        price,
      };
    });
    const orderDetailes: OrderType = {
      userId: new mongoose.Types.ObjectId(userId),
      addressId,
      totalAmount,
      paymentMethod,
      items: formatedItems,
    };
    const order = new Order(orderDetailes);
    await order.save();
    return NextResponse.json({
      success: true,
      message: "Your order has been successfully processed.",
      orderDetailes,
    });
  } catch (error: unknown) {
  let message = "Something went wrong";

  if (error instanceof Error) {
    message = error.message; // safe
  }

  return NextResponse.json({ success: false, message });
}

}
