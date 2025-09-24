import { databaseConnection } from "@/lib/dbConfig";
import Cart, { CartSchemaType } from "@/lib/models/CartModel";
import Product, { ProductType } from "@/lib/models/ProductModel";
import { verifyToken } from "@/lib/tokenmanage/verifyToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cardData = await req.json();
  const { userId, productId, quantityQuery } = cardData;
  try {
    await databaseConnection();
    await verifyToken(req);

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
      if (quantityQuery) {
        existingCartProduct.quantity -= 1;
        existingCartProduct.total -= existProduct.price;
      } else {
        existingCartProduct.quantity += 1;
        existingCartProduct.total += existProduct.price;
      }
      await existingCartProduct.save();
      return NextResponse.json({
        success: true,
        data: { existingCartProduct },
      });
    }
    const cartData: CartSchemaType = {
      userId,
      quantityQuery,
      productId,
      productDetailes: existProduct,
      quantity: 1,
      total: existProduct.price,
      addedAt: new Date(),
    };
    const cart = new Cart(cartData);
    await cart.save();
    return NextResponse.json({
      success: true,
      message: "Cart added successfully",
      data: cart,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.meesage });
  }
}
