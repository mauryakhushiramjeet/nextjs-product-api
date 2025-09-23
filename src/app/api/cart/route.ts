import { databaseConnection } from "@/lib/dbConfig";
import Cart, { CartSchemaType } from "@/lib/models/CartModel";
import Product from "@/lib/models/ProductModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cardData = await req.json();
  const { userId, productId } = cardData;
  try {
    await databaseConnection();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product Id is not found",
      });
    }
    const existProduct = await Product.findById(productId);
    if (!existProduct) {
      return NextResponse.json({
        success: false,
        message: "Product is not exist",
      });
    }
    if (!existProduct.available) {
      return NextResponse.json({
        success: false,
        message: "Product is out of stock",
      });
    }
    const existingCartProduct = await Cart.findOne({ userId, productId });
    if (existingCartProduct) {
      existingCartProduct.quantity += 1;
      await existingCartProduct.save();
      return NextResponse.json({
        success: true,
        message: "cart updated",
        data: { existingCartProduct },
      });
    }
    const cartData: CartSchemaType = {
      userId,
      productId,
      quantity: 1,
      addedAt: new Date(),
    };
    const cart = new Cart(cartData);
    await cart.save();
    return NextResponse.json({
      succes: true,
      message: "Cart added successfully",
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.meesage });
  }
}
